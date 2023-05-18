import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { DestinoViaje } from '../models/destino-viaje.model';
import { fromEvent } from 'rxjs';
import { Observable } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';



@Component({
  selector: 'app-form-destino-viaje',
  templateUrl: './form-destino-viaje.component.html',
  styleUrls: ['./form-destino-viaje.component.css']
})

export class FormDestinoViajeComponent implements OnInit {
  @Output() onItemAdded: EventEmitter<DestinoViaje>;
  fg: FormGroup;
  minLongitud = 4;
  searchResults: any;

  constructor(fb: FormBuilder) { 
    //inicializar
    this.onItemAdded = new EventEmitter();
    //vinculacion con tag html
    this.fg = fb.group({
      nombre: ['', Validators.compose([
        Validators.required,
        this.nombreValidator
        //this.nombreValidatorParametrizable(this.minLongitud)
      ])],
      url: ['']
    });
    
    //observador de tipeo
    this.fg.valueChanges.subscribe((form: any) =>{
      console.log('cambio el formulario: ', form);
    })
  }

    ngOnInit(): void {
    let elemNombre = <HTMLInputElement>document.getElementById('nombre');
    fromEvent(elemNombre,'input')
      .pipe(
        map((e )=>(e.target as HTMLInputElement).value),
        filter(text => text.length>2),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(()=>ajax('/assets/datos.json'))
      ).subscribe(ajaxResponse => this.searchResults = ajaxResponse.response);
  }

 
  guardar(nombre: string, url: string): boolean {
    const d = new DestinoViaje(nombre, url);
    this.onItemAdded.emit(d);
    return false;
  }

  nombreValidator(control: FormControl): { [s:string]: boolean } {
    const longitud = control.value.toString().trim().length;
    if(longitud > 0 && longitud < 5){
      return { invalidNombre: true}  //no hace falta comillas si el nombre es sin espacios
    }
    return {null: false};
  }

  nombreValidatorParametrizable(minLong: number): ValidatorFn {
    return (control: AbstractControl): { [s: string]: boolean } | null => {  //abstract control porque FomrControl fallaba
      const longitud = control.value.toString().trim().length;
      if(longitud > 0 && longitud < minLong){
        return { minLongNombre: true}  //no hace falta comillas si el nombre es sin espacios
      }
      return {null: false};
    }
  }

}