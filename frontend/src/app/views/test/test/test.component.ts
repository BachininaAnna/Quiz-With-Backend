import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TestService} from "../../../shared/services/test.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {TestType} from "../../../../types/test.type";
import {UserResultType} from "../../../../types/user-result.type";
import {AuthService} from "../../../core/auth/auth.service";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  quiz!: TestType;
  timerseconds: number = 60;
  private interval: number = 0;
  currentQuestionIndex: number = 1;
  chosenAnswerId: number | null = null;
  readonly userResult: UserResultType[] = [];

  constructor(private activatedRoute: ActivatedRoute,
              private testService: TestService,
              private authService: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.testService.getQuiz(params['id'])
          .subscribe((result: DefaultResponseType | TestType) => {

            if ((result as DefaultResponseType).error !== undefined) {
              throw new Error((result as DefaultResponseType).message);
            }

            this.quiz = result as TestType;
            this.startIntervalQuiz();
          })
      }
    })
  }

  get activeQuestion() {
    return this.quiz.questions[this.currentQuestionIndex - 1];
  }

  startIntervalQuiz() {
    this.interval = window.setInterval(() => {
      this.timerseconds--;
      if (this.timerseconds === 0) {
        clearInterval(this.interval);
        this.complete();
      }
    }, 1000);
  }

  complete(): void {
    const userInfo = this.authService.getUserInfo();
    if (userInfo && userInfo.userId) {
      this.testService.passQuiz(this.quiz.id, userInfo.userId, this.userResult)
        .subscribe(result => {
          if (result) {
            if ((result as DefaultResponseType).error !== undefined) {
              throw new Error((result as DefaultResponseType).message);
            }
            this.router.navigate(['/result'], {queryParams: {id: this.quiz.id}});
          }
        })
    }

  }

  move(action: string): void {

    const existingResult: UserResultType | undefined = this.userResult.find(item => {
      return item.questionId === this.activeQuestion.id
    });

    if (existingResult) {
      existingResult.chosenAnswerId = this.chosenAnswerId;
    } else {
      this.userResult.push({
        questionId: this.activeQuestion.id,
        chosenAnswerId: this.chosenAnswerId
      })
    }

    if (action === 'pass' || action === 'next') {
      if (this.currentQuestionIndex === this.quiz.questions.length) {
        clearInterval(this.interval);
        this.complete();
        return;
      }

      this.currentQuestionIndex++;
    } else {
      this.currentQuestionIndex--;
    }

    const currentResult: UserResultType | undefined = this.userResult.find(item => {
      return item.questionId === this.activeQuestion.id
    })
    if (currentResult) {
      this.chosenAnswerId = currentResult.chosenAnswerId;
    } else {
      this.chosenAnswerId = null;
    }


  }
}
