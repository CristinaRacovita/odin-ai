import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CsvService } from 'src/app/shared/services/csv.service';
import { SectionService } from 'src/app/shared/services/section.service';

@Component({
  selector: 'app-industry-use-case',
  templateUrl: './industry-use-case.component.html',
  styleUrls: ['./industry-use-case.component.scss'],
})
export class IndustryUseCaseComponent {
  public data: Observable<any> = this.csvService.processFile(
    this.sectionService.activeUseCase.value
  );

  public constructor(private csvService: CsvService, private sectionService: SectionService) {}
}
