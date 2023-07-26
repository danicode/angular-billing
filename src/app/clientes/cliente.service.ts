import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { Cliente } from './cliente';
import { Region } from './region';
import { CLIENTES } from './clientes.json';
import { Observable, catchError, tap } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { of, map, throwError } from 'rxjs';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:6868/api/clientes';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router) { }

  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(`${this.urlEndPoint}/regiones`);
  }

  getClientes(page: number): Observable<any> {

    return this.http
      .get(`${this.urlEndPoint}/page/${page}`)
      .pipe(
        tap((response: any) => {
          // response de tipo Object
          (response.content as Cliente[]).forEach( cliente => {
            console.log(cliente.nombre);
          })
        }),
        map((response: any) => {
          (response.content as Cliente[]).map(cliente => {
            cliente.nombre = cliente.nombre.toUpperCase();
            return cliente;
          });
          return response;
        }),
        tap(response => {
          console.log('ClienteService: tap 2');
          // response de tipo Cliente porque el map retorna de tipo Cliente. Es importante el lugar donde ejecutamos el tap
          (response.content as Cliente[]).forEach( cliente => {
            console.log(cliente.nombre);
          })
        })
      );
  }

  /*getClientes(): Observable<Cliente[]> {
    //return of(CLIENTES);
    //return this.http.get<Cliente[]>(this.urlEndPoint);
    // return this.http
    //   .get(this.urlEndPoint)
    //   .pipe(
    //     map(response => response as Cliente[])
    //   );

    return this.http
      .get(this.urlEndPoint)
      .pipe(
        tap(response => {
          // response de tipo Object
          const clientes = response as Cliente[];
          console.log('ClienteService: tap 1');
          clientes.forEach( cliente => {
            console.log(cliente.nombre);
          })
        }),
        map(response => {
          const clientes = response as Cliente[];
          return clientes.map(cliente => {
            cliente.nombre = cliente.nombre.toUpperCase();
            
            //let datePipe = new DatePipe('en-US');
            //let datePipe = new DatePipe('es');
            //cliente.createAt = datePipe.transform(cliente.createAt, 'fullDate') as string;
            //cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy') as string;
            //cliente.createAt = datePipe.transform(cliente.createAt, 'dd/MM/yyyy') as string;
            //cliente.createAt = formatDate(cliente.createAt, 'dd/MM/yyyy', 'en-US');
            return cliente;
          });
        }),
        tap(response => {
          console.log('ClienteService: tap 2');
          // response de tipo Cliente porque el map retorna de tipo Cliente. Es importante el lugar donde ejecutamos el tap
          response.forEach( cliente => {
            console.log(cliente.nombre);
          })
        })
      );
  }*/

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.urlEndPoint, cliente, { headers: this.httpHeaders }).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {

        if (e.status == 400) {
          return throwError(() => e);
        }

        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(() => e);
      })
    );
  }

  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${ this.urlEndPoint }/${ id }`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(() => e);
      })
    );
  }

  update(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${ this.urlEndPoint }/${ cliente.id }`, cliente, { headers: this.httpHeaders }).pipe(
      catchError(e => {

        if (e.status == 400) {
          return throwError(() => e);
        }

        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(() => e);
      })
    );
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${ this.urlEndPoint }/${ id }`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(() => e);
      })
    );
  }

  subirFoto(archivo: File, id: number): Observable<HttpEvent<{}>> {

    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id.toString());

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(req);
  }

}
