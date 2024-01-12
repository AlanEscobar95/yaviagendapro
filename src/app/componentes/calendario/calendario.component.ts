import { Component, OnInit } from '@angular/core';
import { CalendarOptions, DateSelectArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import { TareasService } from 'src/app/servicios/tareas.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    selectable: true,
    select: this.handleDateSelect.bind(this),
    locale: esLocale,
    events: [],
    eventContent: this.customEventContent.bind(this),
  };

  constructor(private _tareasService: TareasService, 
    private toastr: ToastrService,
    private router: Router) {}

  ngOnInit(): void {
    this.obtenerTareas();
  }

  obtenerTareas() {
    this._tareasService.getTareas().subscribe(
      tareas => {
        console.log('Tareas obtenidas:', tareas);
        this.calendarOptions.events = tareas.map(tarea => ({
          id: tarea.id,
          title: tarea.nombre,
          start: tarea.fechaInicio,
          end: tarea.fechaFin
        }));
      },
      error => {
        console.error('Error al obtener tareas:', error);
      }
    );
  }

  actualizarVistaCalendario(eventId: string) {
    if (this.calendarOptions && Array.isArray(this.calendarOptions.events)) {
      this.calendarOptions.events = this.calendarOptions.events.filter(event => event.id !== eventId);
      this.calendarOptions = { ...this.calendarOptions };
    } else {
      console.error('this.calendarOptions no está definido o no tiene la propiedad events. Asegúrate de inicializarlo correctamente.');
    }
  }

  eliminarEvento(eventId: string) {
    this._tareasService.EliminarTareas(eventId).then(() => {
      this.toastr.success('La Tarea fue eliminada con éxito', 'Registro Eliminado');
      this.actualizarVistaCalendario(eventId);
    }).catch(error => {
      console.error('Error al eliminar tarea:', error);
    });
  }

  customEventContent(arg: any) {
    const deleteButton = document.createElement('span');
    deleteButton.innerHTML = '&times;';
    deleteButton.className = 'delete-button';
    deleteButton.onclick = () => this.eliminarEvento(arg.event.id);

    const editButton = document.createElement('span');
    editButton.innerHTML = '✎';  // Icono de lápiz para editar
    editButton.className = 'edit-button';
    editButton.onclick = () => this.editarEvento(arg.event.id);

    const content = document.createElement('div');
    content.appendChild(document.createTextNode(arg.event.title));
    content.appendChild(deleteButton);
    content.appendChild(editButton);

    return { domNodes: [content] };
  }

  editarEvento(eventId: string) {
    this.router.navigate(['/editar-tareas', eventId]);
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const selectedDate = selectInfo.startStr;
    console.log('Fecha seleccionada:', selectedDate);
  }
}
