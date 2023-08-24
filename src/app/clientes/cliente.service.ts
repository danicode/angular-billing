import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Region } from './region';
import { Observable, catchError, tap } from 'rxjs';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../usuarios/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  //http://localhost:8080/api/clientes
  private urlEndPoint: string = environment.client_url;

  //http://localhost:8080/api/clientes/regiones
  private regionesEndPoint: string = environment.region_url;

  private clientPageEndPoint: string = environment.client_page_url;

  private clientUploadEndPoint: string = environment.client_upload_url;

  constructor(private http: HttpClient, private router: Router,
    private authService: AuthService) { }

  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(this.regionesEndPoint).pipe(
      catchError(e => {
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
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

  create(cliente: Cliente): Observable<Cliente> {
    //return this.http.post(this.urlEndPoint, cliente, {headers: {'Content-Type': 'application/json'} }).pipe(
    return this.http.post(this.urlEndPoint, cliente).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
        if (e.status == 400) {
          return throwError(() => e);
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(() => e);
      })
    );
  }

  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${ this.urlEndPoint }/${ id }`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/clientes']);
          console.error(e.error.mensaje);
        }
        return throwError(() => e);
      })
    );
  }

  update(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${ this.urlEndPoint }/${ cliente.id }`, cliente).pipe(
      catchError(e => {
        if (e.status == 400) {
          return throwError(() => e);
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(() => e);
      })
    );
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${ this.urlEndPoint }/${ id }`).pipe(
      catchError(e => {
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(() => e);
      })
    );
  }

  subirFoto(archivo: File, id: number): Observable<HttpEvent<{}>> {

    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id.toString());

    const req = new HttpRequest('POST', this.clientUploadEndPoint, formData, {
      reportProgress: true,
    });

    return this.http.request(req);
  }
}
