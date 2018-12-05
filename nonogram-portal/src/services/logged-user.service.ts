import { Injectable, EventEmitter} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoggedUserService {
  
  private token: string;
  private logInEmitter: EventEmitter<LogEvent> = new EventEmitter();

  constructor(private http: HttpClient) { }

  GetToken(): string
  {
    return this.token;
  }

  GetLogInEmitter(): EventEmitter<LogEvent>
  {
    return this.logInEmitter;
  }

  LogIn(nick: string, password: string): void
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded'
      })
    }

    let body = new URLSearchParams();
    body.set('username', nick);
    body.set('password', password);
    body.set('grant_type', 'password');

    let logEvent = new LogEvent();

    this.http.post<AccessToken>("api/token", body.toString(), httpOptions).subscribe(at=>{

      this.token = at.access_token;
      logEvent.type = LogType.LogIn;
      logEvent.userName = at.userName;
      this.logInEmitter.emit(logEvent);

    },err => {

      logEvent.type = LogType.Reject;
      this.logInEmitter.emit(logEvent);

    });
  }

  LogOut(): void
  {
    this.token = null;

    let logEvent = new LogEvent();
    logEvent.type = LogType.LogOut;

    this.logInEmitter.emit(logEvent);
  }
}

export enum LogType
{
  LogIn,
  LogOut,
  Reject
}

export class LogEvent
{
  public type: LogType
  public userName: string
}

class AccessToken
{
  public access_token: string
  public userName: string
}
