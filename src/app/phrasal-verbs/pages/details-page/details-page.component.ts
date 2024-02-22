import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { PhrasalVerb } from '../../interfaces/phrasal-verb.interface';
import { PhrasalVerbsService } from '../../services/phrasal-verbs.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-details-page',
  templateUrl: './details-page.component.html',
  styles: [
  ]
})
export class DetailsPageComponent implements OnInit {
  public phrasalVerb?: PhrasalVerb;
  phrasalVerb$!: Observable<PhrasalVerb>;


  constructor(private phrasalVerbService: PhrasalVerbsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.phrasalVerb$ = this.activatedRoute.params.pipe(
      switchMap(({ id }) => this.phrasalVerbService.getPhrasalVerbById(id))
    );
    this.phrasalVerb$.subscribe({
      next: (phrasalVerb: PhrasalVerb) => {
        if (!phrasalVerb) return this.router.navigate(['/phrasal-verbs/list']);
        this.phrasalVerb = phrasalVerb;
        return;
      },
      error: (error) => {
        console.error('Error al obtener el documento:', error);
      }
    });
  }

  deletePhrasalVerb() {
    const id = this.activatedRoute.snapshot.params['id'];

    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.phrasalVerbService.deletePhrasalVerb(id);
        this.router.navigate(['/phrasal-verbs/list']);

        Swal.fire(
          '¡Eliminado!',
          'Tu archivo ha sido eliminado.',
          'success'
        );
      }
    });


  }

  goBack() {
    this.router.navigateByUrl('phrasal-verbs/list');
  }
}





