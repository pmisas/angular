import {  Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DestinoViaje } from '../models/destino-viaje.model';
import { DestinosApiClient } from './../models/destinos-api-client.model';

@Component({
  selector: 'app-lista-destinos',
  templateUrl: './lista-destinos.component.html',
  styleUrls: ['./lista-destinos.component.css']
})
export class ListaDestinosComponent implements OnInit {
  @Output() onItemAdded:EventEmitter<DestinoViaje>;
  //destinos: DestinoViaje[];
  updates: string[];

  constructor(public destinosApiClient:DestinosApiClient) { 
    this.onItemAdded = new EventEmitter();
    this.updates = [];
    this.destinosApiClient.suscribeOnChange((d: DestinoViaje) => {
      if (d.nombre != "") {
        this.updates.push('se ha elegido a ' + d.nombre);
      }
    });
  }
  ngOnInit() {
    console.log(this.updates);
  }

  //guardar(nombre:string, url:string):boolean {
  //  this.destinos.push(new DestinoViaje(nombre, url));
  //  return false; 
  //}

  agregado(d: DestinoViaje) {
    this.destinosApiClient.add(d);
    this.onItemAdded.emit(d);
  }


  elegido(e: DestinoViaje) {
    //desmarcar todos los demas en en array de elegidos
    //this.destinos.forEach(function (x) {x.setSelected(false); });
    //se marca el elegido
    //d.setSelected(true);
    this.destinosApiClient.elegir(e);
  }
}
