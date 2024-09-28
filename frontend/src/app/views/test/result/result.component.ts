import {Component, OnInit} from '@angular/core';
import {TestService} from "../../../shared/services/test.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {AuthService} from "../../../core/auth/auth.service";
import {PassTestResponseType} from "../../../../types/pass-test-response.type";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  result: string  = '';
  testId: string = '';

  constructor(private testService: TestService,
              private authService: AuthService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      if (params['id']) {
        this.testId = params['id'];
        const userInfo = this.authService.getUserInfo();
        if (userInfo && userInfo.userId) {
          this.testService.getResultQuiz(params['id'], userInfo.userId)
            .subscribe(result => {
              if (result) {
                if ((result as DefaultResponseType).error !== undefined) {
                  throw new Error((result as DefaultResponseType).message);
                }

                this.result = (result as PassTestResponseType).score + '/' + (result as PassTestResponseType).total;
              }
            })

        }
      }

    })

  }

}
