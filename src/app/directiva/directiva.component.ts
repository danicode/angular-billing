import { Component } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html',
  styleUrls: ['./directiva.component.css']
})
export class DirectivaComponent {
  habilitar:boolean = true;
  listaCurso:string[] = ['TypeScript', 'JavaScript', 'Java SE', 'C#', 'PHP'];

  setHabilitar():void {
    this.habilitar = !this.habilitar;
  }
}
