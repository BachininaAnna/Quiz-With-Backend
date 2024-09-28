import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {QuizListType} from "../../../types/quiz-list.type";
import {Observable} from "rxjs";
import {TestResultType} from "../../../types/test-result.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {TestType} from "../../../types/test.type";
import {PassTestResponseType} from "../../../types/pass-test-response.type";
import {UserResultType} from "../../../types/user-result.type";

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private http: HttpClient) {
  }

  getTests(): Observable<QuizListType[]> {
    return this.http.get<QuizListType[]>(environment.apiHost + 'tests');
  }

  getUserResults(userId: number): Observable<TestResultType[] | DefaultResponseType> {
    return this.http.get<TestResultType[] | DefaultResponseType>(environment.apiHost + 'tests/results?userId=' + userId);
  }

  getQuiz(id: number | string): Observable<DefaultResponseType | TestType> {
    return this.http.get<DefaultResponseType | TestType>(environment.apiHost + 'tests/' + id);
  }

  passQuiz(testId: number | string,
           userId: number | string,
           userResult: UserResultType[])
    : Observable<DefaultResponseType | PassTestResponseType> {
    return this.http.post<DefaultResponseType | PassTestResponseType>(environment.apiHost + 'tests/' + testId + '/pass', {
      userId: userId,
      results: userResult
    });
  }

  getResultQuiz(testId: number | string,
                userId: number | string): Observable<DefaultResponseType | PassTestResponseType> {
    return this.http.get<DefaultResponseType | PassTestResponseType>
    (environment.apiHost + 'tests/' + testId + '/result?userId=' + userId);
  }
  getTestWithResults(testId: number | string,
                     userId: number | string): Observable<DefaultResponseType | {test:TestType}> {
    return this.http.get<DefaultResponseType | {test:TestType}>
    (environment.apiHost + 'tests/' + testId + '/result/details?userId=' + userId);
  }
}
