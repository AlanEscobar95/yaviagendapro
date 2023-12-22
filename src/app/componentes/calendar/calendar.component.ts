import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  currentMonth!: Date;
  daysOfWeek: string[] = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  weeks: { date: Date, events: { title: string }[] }[][] = [];

  ngOnInit() {
    this.currentMonth = new Date();
    this.generateCalendar();
  }

  generateCalendar() {
    const startDate = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const endDate = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);

    const weeks: { date: Date, events: { title: string }[] }[][] = [];
    let currentWeek: { date: Date, events: { title: string }[] }[] = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
      const newDate = new Date(currentDate);
      const events = this.getEventsForDate(currentDate);

      currentWeek.push({ date: newDate, events });

      if (currentDate.getDay() === 6) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    this.weeks = weeks;
  }

  goToPreviousMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.generateCalendar();
  }

  goToNextMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.generateCalendar();
  }

  showEventsForDay(day: { date: Date, events: { title: string }[] }) {
 
    console.log('Eventos para el día:', day.date.toDateString(), day.events);
  }


  getEventsForDate(date: Date): { title: string }[] {
    return [
      { title: 'Reunión de trabajo' },
      { title: 'Cita con el cliente' },
    ];
  }
}
