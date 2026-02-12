import { Injectable } from "@angular/core";
import Swal from "sweetalert2";

@Injectable({
    providedIn: 'root'
})
export class AlertsService {
    constructor() { }

    success(message: string) {
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: message,
            confirmButtonText: 'OK'
        });
    }

    error(message: string) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message,
            confirmButtonText: 'OK'
        });
    }

    warning(message: string) {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: message,
            confirmButtonText: 'OK'
        });
    }

    info(message: string) {
        Swal.fire({
            icon: 'info',
            title: 'Información',
            text: message,
            confirmButtonText: 'OK'
        });
    }

    question(message: string) {
        return Swal.fire({
            icon: 'question',
            title: '¿Estás seguro?',
            text: message,
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No'
        });
    }
}