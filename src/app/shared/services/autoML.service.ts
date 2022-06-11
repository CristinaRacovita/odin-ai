import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as saveAs from 'file-saver';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ErrorDialogComponent } from 'src/app/components/dialogs/error-dialog/error-dialog.component';
import { TestingResultDto } from '../dtos/testing-result.dto';
import { TestingDto } from '../dtos/testing.dto';
import { TrainingResultDto } from '../dtos/training-result.dto';
import { TrainingDto } from '../dtos/training.dto';
import { TestingResultModel } from '../models/testing-result.model';
import { TestingModel } from '../models/testing.model';
import { TrainingResultModel } from '../models/training-result.model';
import { TrainingModel } from '../models/training.model';

@Injectable()
export class AutoMLService {
  private baseUrl = 'https://odin-ai-backend-on.azurewebsites.net/backend/';
  public learningReport = new BehaviorSubject<string>('');
  public testingReport = new BehaviorSubject<string>('');
  public predictedColumn = new BehaviorSubject<string>('');
  public trainingDatasetName = new BehaviorSubject<string>('');

  public constructor(private http: HttpClient, private dialog: MatDialog) {}

  public startLearning(
    trainingModel: TrainingModel
  ): Observable<TrainingResultModel | null> {
    trainingModel.targetColumn = trainingModel.targetColumn.replace('\r', '');
    console.log(this.trainingModelToTrainingDto(trainingModel));

    return this.http
      .post<TrainingResultDto>(
        `${this.baseUrl}train/`,
        this.trainingModelToTrainingDto(trainingModel)
      )
      .pipe(
        map((res: TrainingResultDto) =>
          this.trainingResultDtoToTrainingResultModel(res)
        ),

        catchError((err) => {
          this.dialog.open(ErrorDialogComponent);
          return of(null);
        })
      );
  }

  public predict(testingModel: TestingModel): Observable<TestingResultModel> {
    testingModel.targetColumn = testingModel.targetColumn.replace('\r', '');

    return this.http
      .post<TestingResultDto>(
        `${this.baseUrl}test/`,
        this.testingModelToTestingDto(testingModel)
      )
      .pipe(
        map((res: TestingResultDto) =>
          this.testingResultDtoToTestingResultModel(res)
        )
      );
  }

  public downloadCSV(fileContent: string): void {
    const data: Blob = new Blob([fileContent], {
      type: 'text/csv;charset=utf-8',
    });

    saveAs(
      data,
      this.trainingDatasetName.value.replace('.csv', '') + '_solution.csv'
    );
  }

  private trainingModelToTrainingDto(
    trainingModel: TrainingModel
  ): TrainingDto {
    return new TrainingDto(
      trainingModel.targetColumn,
      trainingModel.fileContent,
      trainingModel.filename
    );
  }

  private trainingResultDtoToTrainingResultModel(
    trainingResultDto: TrainingResultDto
  ): TrainingResultModel {
    return new TrainingResultModel(
      trainingResultDto.metric,
      trainingResultDto.score
    );
  }

  private testingModelToTestingDto(testingModel: TestingModel): TestingDto {
    return new TestingDto(
      testingModel.targetColumn,
      testingModel.fileContent,
      testingModel.filename,
      testingModel.trainFilename
    );
  }

  private testingResultDtoToTestingResultModel(
    testingResultDto: TestingResultDto
  ): TestingResultModel {
    return new TestingResultModel(
      testingResultDto.metric,
      testingResultDto.score,
      testingResultDto.file
    );
  }
}
