using System;

namespace NonogramPortalApi.Dtos
{
    public class CommentDto
    {
        public int Id { get; set; }

        public string Content { get; set; }
        public DateTime DateTime { get; set; }

        public string UserId { get; set; }
        public string AvatarHash { get; set; }
    }
}