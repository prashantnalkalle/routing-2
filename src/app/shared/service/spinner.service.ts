import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  constructor() { }

 private loding$:BehaviorSubject<boolean> = new BehaviorSubject(false)

 lodingobs$:Observable<boolean> = this.loding$.asObservable()

 spinnershow() {
  this.loding$.next(true)
 }

 hidespinner() {
  this.loding$.next(false)
 }

}
