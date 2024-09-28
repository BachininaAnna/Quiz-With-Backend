import {Component, OnInit} from '@angular/core';
import {TestService} from "../../../shared/services/test.service";
import {QuizListType} from "../../../../types/quiz-list.type";
import {AuthService} from "../../../core/auth/auth.service";
import {Router} from "@angular/router";
import {UserInfoType} from "../../../../types/user-info.type";
import {TestResultType} from "../../../../types/test-result.type";
import {DefaultResponseType} from "../../../../types/default-response.type";

@Component({
  selector: 'app-choice',
  templateUrl: './choice.component.html',
  styleUrls: ['./choice.component.scss']
})
export class ChoiceComponent implements OnInit {

  public quizzes: QuizListType[] = [];
  private testResult: TestResultType[] | null = null;

  constructor(private testService: TestService, private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.testService.getTests()
      .subscribe((result: QuizListType[]) => {
        this.quizzes = result;


        const userInfo: UserInfoType | null = this.authService.getUserInfo();
        if (userInfo && userInfo.userId) {
          this.testService.getUserResults(userInfo.userId)
            .subscribe((result: TestResultType[] | DefaultResponseType) => {
              if (result) {
                if ((result as DefaultResponseType).error !== undefined) {
                  throw new Error((result as DefaultResponseType).message);
                }

                const testResult = result as TestResultType[];
                this.quizzes = this.quizzes.map(quiz => {
                  const foundItem: TestResultType | undefined = testResult.find(item => item.testId === quiz.id);
                  if (foundItem) {
                    quiz.result = foundItem.score + '/' + foundItem.total;
                  }
                  return quiz;
                })
              }
            })
        }
      })
  }

  public chooseQuiz(id: number): void {
    this.router.navigate(['/test', id])
  }
}
