import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CsvService } from 'src/app/shared/services/csv.service';

@Component({
  selector: 'app-testing-phase',
  templateUrl: './testing-phase.component.html',
  styleUrls: ['./testing-phase.component.scss'],
})
export class TestingPhaseComponent {
  public csvContent = '';
  public file: File | undefined;
  public data = new Observable<any>();
  public columns: string[] = [];
  public isLoading = false;

  public constructor(private csvService: CsvService, private router: Router) {}

  public isFileSelected(): boolean {
    return !(this.file === undefined);
  }

  public isFileContentNotExists(): boolean {
    return this.isFileSelected() && this.csvContent == '';
  }

  public getFile(file: File): void {
    this.file = file;
  }

  public getCsvContent(content: string): void {
    this.csvContent = content;
    this.data = this.csvService.processFile(content);
    this.columns = content.split('\n')[0].split(',');
  }

  public startTesting(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigateByUrl('demo/testing-report')
    }, 5000);
  }
}
