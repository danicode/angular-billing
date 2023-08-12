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
import { environment } from 'src/environments/environment';
import { AuthService } from '../usuarios/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  //private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  private urlEndPoint: string = environment.client_url;

  //http://localhost:8080/api/clientes/regiones
  private regionesEndPoint: string = environment.region_url;

  private clientPageEndPoint: string = environment.client_page_url;

  private clientUploadEndPoint: string = environment.client_upload_url;

  //private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router,
    private authService: AuthService) { }

  /*private addAuthorizationHeader(): HttpHeaders {
    const accessToken = this.authService.accessToken;
    if (accessToken != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + accessToken);
    }
    return this.httpHeaders;
  }*/

  /*private isNoAutorizado(e: any): boolean {
    if (e.status == 401) {

      if (this.authService.isAuthenticated()) { 
        this.authService.logout();
      }

      //swal.fire('Login', `Hola ${this.authService.user?.username} ya estás autenticado!`, 'info');
      swal.fire('Acceso denegado', 'No tienes acceso a este recurso!', 'warning');
      this.router.navigate(['/clientes']);
      //this.router.navigate(['/login']);
      return true;
    }
    if (e.status == 403) {
      swal.fire('Acceso denegado', `Hola ${this.authService.user?.username} no tienes acceso a este recurso!`, 'warning');
      this.router.navigate(['/clientes']);
      return true;
    }
    return false;
  }*/

  getRegiones(): Observable<Region[]> {
    //return this.http.get<Region[]>(this.regionesEndPoint, { headers: this.addAuthorizationHeader() }).pipe(
    return this.http.get<Region[]>(this.regionesEndPoint).pipe(
      catchError(e => {
        //this.isNoAutorizado(e);
        return throwError(() => e);
      })
    );
  }

  getClientes(page: number): Observable<any> {

    return this.http
      .get(this.clientPageEndPoint + page)
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
    //return this.http.post(this.urlEndPoint, cliente, { headers: this.addAuthorizationHeader() }).pipe(
    return this.http.post(this.urlEndPoint, cliente).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {

        /*if (this.isNoAutorizado(e)) {
          return throwError(() => e);
        }*/

        if (e.status == 400) {
          return throwError(() => e);
        }

        //swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(() => e);
      })
    );
  }

  getCliente(id: number): Observable<Cliente> {
    //return this.http.get<Cliente>(`${ this.urlEndPoint }/${ id }`, { headers: this.addAuthorizationHeader() }).pipe(
    return this.http.get<Cliente>(`${ this.urlEndPoint }/${ id }`).pipe(
      catchError(e => {

        /*if (this.isNoAutorizado(e)) {
          return throwError(() => e);
        }*/

        this.router.navigate(['/clientes']);

        //swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(() => e);
      })
    );
  }

  update(cliente: Cliente): Observable<any> {
    //return this.http.put<any>(`${ this.urlEndPoint }/${ cliente.id }`, cliente, { headers: this.addAuthorizationHeader() }).pipe(
    return this.http.put<any>(`${ this.urlEndPoint }/${ cliente.id }`, cliente).pipe(
      catchError(e => {

        /*if (this.isNoAutorizado(e)) {
          return throwError(() => e);
        }*/

        if (e.status == 400) {
          return throwError(() => e);
        }

        //swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(() => e);
      })
    );
  }

  delete(id: number): Observable<Cliente> {
    //return this.http.delete<Cliente>(`${ this.urlEndPoint }/${ id }`, { headers: this.addAuthorizationHeader() }).pipe(
    return this.http.delete<Cliente>(`${ this.urlEndPoint }/${ id }`).pipe(
      catchError(e => {
        /*if (this.isNoAutorizado(e)) {
          return throwError(() => e);
        }*/
        //swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(() => e);
      })
    );
  }

  subirFoto(archivo: File, id: number): Observable<HttpEvent<{}>> {

    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id.toString());

    /*let httpHeaders = new HttpHeaders();
    const accessToken = this.authService.accessToken;
    if (accessToken != null) {
      httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + accessToken);
    }*/

    const req = new HttpRequest('POST', this.clientUploadEndPoint, formData, {
      reportProgress: true,
      //headers: httpHeaders
    });

    return this.http.request(req).pipe(
      catchError((error: any) => {
        //this.isNoAutorizado(error);
        return throwError(() => error);
      })
    ) as Observable<HttpEvent<any>>;
  }

}
