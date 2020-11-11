import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'untitled';
  showData = false;
  labels: any;

  constructor(private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.translate.use('en').subscribe(labels => {
      this.labels = labels;
      this.showData = true;
    });
  }
}
