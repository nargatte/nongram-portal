import { Component } from '@angular/core';
import { LoggedUserService, LogEvent, LogType } from 'src/services/logged-user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'nonogram-portal';

  lnick: string = '';
  lpassword: string = '';
  lresponse: string = '';
  lred: boolean = false;

  onLogIn()
  {
    this.loggedUser.LogIn(this.lnick, this.lpassword);
    this.lnick = '';
    this.lpassword = '';
  }

  onLogOut()
  {
    this.loggedUser.LogOut();
  }

  rnick: string = '';
  rpassword: string = '';
  rmail: string = '';
  rresponse: string = '';

  onSignIn()
  {
    let r = new Register();
    r.Email = this.rmail;
    r.Nick = this.rnick;
    r.Password = this.rpassword;
    this.http.post("api/account/register", r).subscribe(() => {
      this.rresponse = `Pomyślnie zarejestrowano konto ${r.Nick}`;
      this.rnick = '';
      this.rpassword = '';
      this.rmail = '';
    },e =>{
      this.rresponse = e["error"]["ModelState"][""][0];
    })
  }

  aname: string = '';

  onAdd() {
    this.http.post(`api/nonogram?name=${this.aname}`, null).subscribe(()=>this.updateNonograms());
  }

  nonograms: string[];

  updateNonograms() {
    this.http.get("api/nonograms").subscribe((l: string[]) => this.nonograms = l);
  }

  constructor(private loggedUser: LoggedUserService, private http: HttpClient) {
    loggedUser.GetLogInEmitter().subscribe((i: LogEvent) => {
      this.lred = false;
      this.nonograms = [];
      if(i.type == LogType.LogIn){
        this.lresponse = `Witaj ${i.userName}`;
        this.updateNonograms();
      }else if(i.type == LogType.LogOut){
        this.lresponse = "Wylogowano";
      }else{
        this.lresponse = "Złe hasło lub login";
        this.lred = true;
      }
    })
  }

}

class Register {
  public Email: string
  public Password: string
  public Nick: string
}
