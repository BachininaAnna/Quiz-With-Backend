import {Component, OnInit} from '@angular/core';
import {UserInfoType} from "../../../../types/user-info.type";
import {AuthService} from "../../../core/auth/auth.service";
import {ActivatedRoute} from "@angular/router";
import {TestService} from "../../../shared/services/test.service";
import {TestType} from "../../../../types/test.type";
import {DefaultResponseType} from "../../../../types/default-response.type";

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.scss']
})
export class AnswersComponent implements OnInit {
  userInfo: UserInfoType | null = null;
  testId: string = '';
  test: TestType | null = null;

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute, private testService: TestService) {
    if (this.authService.getLoggedIn()) {
      this.userInfo = this.authService.getUserInfo();
    }
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params['id'] && this.userInfo?.userId) {
        this.testId = params['id'];

        this.testService.getTestWithResults(this.testId, this.userInfo?.userId)
          .subscribe((result: {test: TestType} | DefaultResponseType) => {

            if ((result as DefaultResponseType).error !== undefined) {
              throw new Error((result as DefaultResponseType).message);
            }

            this.test = (result as {test: TestType}).test;
          })
      }

    })

  }

}
