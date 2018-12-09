using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using NonogramPortalApi.DataBase;
using NonogramPortalApi.DataBase.Entities;
using NonogramPortalApi.Dtos;
using NonogramPortalApi.Enums;
using NonogramPortalApi.Helpers;
using NonogramPortalApi.Models;

namespace NonogramPortalApi.Repositories
{
    public class NonogramRepository
    {
        private readonly IPortalDbContext _dbContext;
        private readonly Random _random;

        public NonogramRepository(IPortalDbContext dbContext, Random random)
        {
            _dbContext = dbContext;
            _random = random;
        }

        public async Task<NonogramDto> GetNonogramDtoById(int id, string userId = null)
        {
            var nonogramAndExtraData = await _dbContext.Nonograms
                .Select(n => new
                {
                    Nonogram = n,
                    Mail = n.User.Email,
                    totalRate = n.Games.Where(g => g.Rate.HasValue).Average(g => g.Rate.Value),
                    userGame = n.Games.FirstOrDefault(g => g.UserId == userId)
                })
                .FirstOrDefaultAsync(n => n.Nonogram.Id == id);

            if (nonogramAndExtraData == null)
                throw new Exception($"Nonogram with id {id} cannot be found");

            CommentDto[] commentDtos = (await _dbContext.Comments.Where(c => c.NonogramId == id)
                .OrderByDescending(c => c.DateTime)
                .Select(c => new { Comment = c, Mail = c.User.Email }).ToArrayAsync())
                .Select(c => new CommentDto
                {
                    DateTime = c.Comment.DateTime,
                    UserId = c.Comment.UserId,
                    Content = c.Comment.Content,
                    AvatarHash = HashHelper.GetHashFromMail(c.Mail)

                }).ToArray();

            ColourDto[] colourDtos = await _dbContext.Colors.Where(c => c.NonogramId == id)
                .OrderBy(c => c.Index)
                .Select(c => new ColourDto { Red = c.Red, Green = c.Green, Blue = c.Blue })
                .ToArrayAsync();

            byte[] dimensions = await _dbContext.Dimensions.Where(d => d.NonogramId == id)
                .OrderBy(d => d.Index)
                .Select(d => d.Size)
                .ToArrayAsync();

            Nonogram nonogram = nonogramAndExtraData.Nonogram;

            return new NonogramDto
            {
                AccessMode = nonogram.AccessMode,
                UserId = nonogram.UserId,
                AvatarHash = HashHelper.GetHashFromMail(nonogramAndExtraData.Mail),
                Colors = colourDtos,
                Comments = commentDtos,
                CreationDate = nonogram.CreationDate,
                Difficulty = nonogram.Difficulty,
                Dimensions = dimensions,
                Fields = nonogramAndExtraData.userGame?.Fields ?? nonogram.Fields,
                Name = nonogram.Name,
                RuleIndexes = nonogram.RuleIndexes,
                Rules = nonogram.Rules,
                PlayerRate = nonogramAndExtraData.userGame?.Rate ?? 0,
                TotalRate = nonogramAndExtraData.totalRate
            };
        }

        public async Task<int> AddNonogram(NonogramDto nonogramDto)
        {
            Nonogram nonogram = new Nonogram
            {
                Colors = new List<Color>(),
                Dimensions = new List<Dimension>(),
                Link = RandomStringHelper.GenerateRandomString(_random)
            };

            nonogramDto.CreationDate = DateTime.Now;
            UpdateNonogramByNonogramDto(nonogram, nonogramDto);

            _dbContext.Nonograms.Add(nonogram);
            await _dbContext.SaveChangesAsync();

            return nonogram.Id;
        }

        public async Task UpdateNonogram(NonogramDto nonogramDto, int id)
        {
            Nonogram nonogram = await _dbContext.Nonograms.Include(n => n.Comments).Include(n => n.Dimensions).FirstOrDefaultAsync(n => n.Id == id);

            if (nonogram == null)
                throw new Exception($"Nonogram with id {id} cannot be found");

            UpdateNonogramByNonogramDto(nonogram, nonogramDto);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteNonogram(int id)
        {
            Nonogram nonogram = await _dbContext.Nonograms
                .Include(n => n.Comments)
                .Include(n => n.Dimensions)
                .Include(n => n.Comments)
                .Include(n => n.Games)
                .FirstOrDefaultAsync(n => n.Id == id);

            if (nonogram == null)
                throw new Exception($"Nonogram with id {id} cannot be found");

            _dbContext.Nonograms.Remove(nonogram);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<PagedArray<NonogramListItem>> GetPageOfNonogramsList(PagedArrayRequest pagedArrayRequest, NonogramsFilter filter)
        {
            var nonograms = FilterAndOrder(_dbContext.Nonograms, filter);

            var nonogramsAndExtraInformations = nonograms.Select(n => new
            {
                nonogram = n,
                email = n.User.Email,
                numberOfPlays = n.Games.Count,
                numberOfWins = n.Games.Count(g => g.EndDate.HasValue),
                averageTime = n.Games.Where(g => g.EndDate.HasValue)
                    .Average(g => (g.EndDate.Value - g.StartDate).Minutes),
                numberOfDimensions = n.Dimensions.Count,
                numberOfColors = n.Colors.Count,
                lastSaveDate = n.Games.FirstOrDefault(g => g.UserId == filter.UserIdPlayer).LastSaveDate,
                endDate = n.Games.FirstOrDefault(g => g.UserId == filter.UserIdPlayer).EndDate,
            });

            var pagedNonorgramsAndExtraInformations = await nonogramsAndExtraInformations
                .Skip(pagedArrayRequest.PageNumber * pagedArrayRequest.NumberOfItemsOnPage)
                .Take(pagedArrayRequest.NumberOfItemsOnPage).ToArrayAsync();

            var nonogramListItems = pagedNonorgramsAndExtraInformations.Select(a => new NonogramListItem
            {
                Name = a.nonogram.Name,
                Difficulty = a.nonogram.Difficulty,
                CreationDate = a.nonogram.CreationDate,
                Size = a.nonogram.Size,
                NumberOfDimensions = a.numberOfDimensions,
                NumberOfColors = a.numberOfColors,
                NumberOfPlays = a.numberOfPlays,
                NumberOfWins = a.numberOfWins,
                AverageMinutesOfPlay = (int)a.averageTime,
                UserId = a.nonogram.UserId,
                AvatarHash = HashHelper.GetHashFromMail(a.email),
                EndDate = a.endDate,
                LastSaveDate = a.lastSaveDate
            }).ToArray();

            int totalNumber = await Filtering(_dbContext.Nonograms, filter).CountAsync();

            return new PagedArray<NonogramListItem>
                {PartOfElements = nonogramListItems, TotalNumberOfElements = totalNumber};
        }

        public async Task<NonogramDto> GetRandomNonogram(NonogramsFilter filter)
        {
            int totalNumber = await Filtering(_dbContext.Nonograms, filter).CountAsync();
            int randomPosition = _random.Next(totalNumber);
            int randomId = await Filtering(_dbContext.Nonograms, filter).OrderBy(n => n.CreationDate).Skip(randomPosition)
                .Select(n => n.Id).FirstAsync();
            return await GetNonogramDtoById(randomId);
        }

        private IQueryable<Nonogram> FilterAndOrder(IQueryable<Nonogram> nonograms, NonogramsFilter filter)
        {
            nonograms = Filtering(nonograms, filter);
            return OrderByFilter(nonograms, filter);
        }

        private IQueryable<Nonogram> Filtering(IQueryable<Nonogram> nonograms, NonogramsFilter filter)
        {
            if (filter.MinDimension.HasValue)
                nonograms = nonograms.Where(n => n.Dimensions.Count() >= filter.MinDimension);

            if (filter.MaxDimension.HasValue)
                nonograms = nonograms.Where(n => n.Dimensions.Count() <= filter.MaxDimension);

            if (filter.MinSize.HasValue)
                nonograms = nonograms.Where(n => n.Size >= filter.MinSize);

            if (filter.MaxSize.HasValue)
                nonograms = nonograms.Where(n => n.Size <= filter.MaxSize);

            if (filter.MinColors.HasValue)
                nonograms = nonograms.Where(n => n.Colors.Count() >= filter.MinColors);

            if (filter.MaxColors.HasValue)
                nonograms = nonograms.Where(n => n.Colors.Count() <= filter.MaxColors);

            if (filter.UserIdOwner != null)
                nonograms = nonograms.Where(n => n.UserId == filter.UserIdOwner);

            if (filter.UserIdPlayer != null && filter.HideThatAlreadyPlayed)
                nonograms = nonograms.Where(n => n.Games.All(g => g.UserId != filter.UserIdPlayer));

            if (filter.AccessMode.HasValue)
                nonograms = nonograms.Where(n => n.AccessMode == filter.AccessMode);

            return nonograms;
        }

        private IQueryable<Nonogram> OrderByFilter(IQueryable<Nonogram> nonograms, NonogramsFilter filter)
        {
            switch (filter.NonogramSortOption)
            {
                case NonogramSortOption.ByCreationDate:
                    nonograms = filter.Descending
                        ? nonograms.OrderByDescending(n => n.CreationDate)
                        : nonograms.OrderBy(n => n.CreationDate);
                    break;

                case NonogramSortOption.ByDifficulty:
                    nonograms = filter.Descending
                        ? nonograms.OrderByDescending(n => n.Difficulty)
                        : nonograms.OrderBy(n => n.Difficulty);
                    break;

                case NonogramSortOption.ByName:
                    nonograms = filter.Descending
                        ? nonograms.OrderByDescending(n => n.Name)
                        : nonograms.OrderBy(n => n.Name);
                    break;

                case NonogramSortOption.BySize:
                    nonograms = filter.Descending
                        ? nonograms.OrderByDescending(n => n.Size)
                        : nonograms.OrderBy(n => n.Size);
                    break;

                case NonogramSortOption.ByNumberOfPlays:
                    nonograms = filter.Descending
                        ? nonograms.OrderByDescending(n => n.Games.Count)
                        : nonograms.OrderBy(n => n.Games.Count);
                    break;

                case NonogramSortOption.ByAverageTimeOfPlay:
                    nonograms = filter.Descending
                        ? nonograms.OrderByDescending(n =>
                            n.Games.Where(g => g.EndDate.HasValue)
                                .Average(g => (g.EndDate.Value - g.StartDate).Minutes))
                        : nonograms.OrderBy(n =>
                            n.Games.Where(g => g.EndDate.HasValue)
                                .Average(g => (g.EndDate.Value - g.StartDate).Minutes));
                    break;
            }

            return nonograms;
        }

        private void UpdateNonogramByNonogramDto(Nonogram nonogram, NonogramDto nonogramDto)
        {
            nonogram.Fields = nonogramDto.Fields;
            nonogram.RuleIndexes = nonogramDto.RuleIndexes;
            nonogram.Rules = nonogramDto.Rules;
            nonogram.AccessMode = nonogramDto.AccessMode;
            nonogram.CreationDate = nonogramDto.CreationDate;
            nonogram.Name = nonogramDto.Name;
            nonogram.Difficulty = nonogramDto.Difficulty;
            nonogram.UserId = nonogramDto.UserId;
            nonogram.Size = nonogramDto.Dimensions.Cast<int>().Aggregate((a, b) => a * b);

            var dim = nonogramDto.Dimensions.Select(b => new { var = b }).ToArray();
            UpdateListOfEntitiesInDbContext(nonogram.Dimensions.ToList(), dim, _dbContext.Dimensions,
                (dimensionsDb, dimensionsDto, index) =>
                {
                    dimensionsDb.Index = index;
                    dimensionsDb.NonogramId = nonogram.Id;
                    dimensionsDb.Size = dimensionsDto.var;
                });

            UpdateListOfEntitiesInDbContext(nonogram.Colors.ToList(), nonogramDto.Colors, _dbContext.Colors,
                (colourDb, colourDto, index) =>
                {
                    colourDb.Index = index;
                    colourDb.NonogramId = nonogram.Id;
                    colourDb.Green = colourDto.Green;
                    colourDb.Red = colourDto.Red;
                    colourDb.Blue = colourDto.Blue;
                });
        }

        private void UpdateListOfEntitiesInDbContext<TEntity, TDto>(
            ICollection<TEntity> entitiesCollection,
            TDto[] dtos,
            IDbSet<TEntity> contextCollection,
            Action<TEntity, TDto, int> updateEntity)
            where TEntity : class, new()
            where TDto : class
        {
            var entities = entitiesCollection.ToList();
            var entitiesCount = entities.Count;

            if (entities.Count > dtos.Length)
                for (int i = dtos.Length; i < entities.Count; i++)
                    contextCollection.Remove(entities[i]);

            else if (entities.Count < dtos.Length)
                for (int i = 0; i < dtos.Length - entitiesCount; i++)
                {
                    var entity = new TEntity();
                    entities.Add(entity);
                    contextCollection.Add(entity);
                }

            for (int i = 0; i < dtos.Length; i++)
                updateEntity(entities[i], dtos[i], i);

            entitiesCollection.Clear();
            foreach (var t in entities)
                entitiesCollection.Add(t);
        }
    }
}