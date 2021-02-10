/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'apps/booster/src/environments/environment';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResult } from '../models/Api-results';
import { Launch } from '../models/Launch';

@Injectable({
  providedIn: 'root',
})
export class LaunchesService {
  private readonly endpoint = 'launch';

  constructor(private http: HttpClient) {}

  getById$(launchId: string) {
    const launchByIdUrl = `${this.getEndpointUrl()}/${launchId}/`;
    return this.http.get<Launch>(launchByIdUrl).pipe();
  }

  // ToDo: reuse pipe --->

  getByQuery$(queryParams: { numberOfLaunches: number; searchTerm: string }) {
    const endPointUrl = `${this.getEndpointUrl()}?${this.modeList()}`;
    const query = `${queryParams.numberOfLaunches}&search=${queryParams.searchTerm}`;
    const launchesByQueryUrl = `${endPointUrl}&${query}`;
    return this.http.get<ApiResult>(launchesByQueryUrl).pipe(
      map((data) => this.transformLaunchData(data)),
      catchError((err) => of([]))
    );
  }

  getUpcoming$() {
    const endPointUrl = `${this.getEndpointUrl()}/upcoming?${this.modeList()}`;
    return this.http.get<ApiResult>(endPointUrl).pipe(
      map((data) => this.transformLaunchData(data)),
      catchError((err) => of([]))
    );
  }
  private transformLaunchData(data: ApiResult): any[] {
    return data.results.map((result) => ({
      ...result,
      agencyName: result['lsp_name'],
    }));
  }

  private getEndpointUrl(modeList?: boolean) {
    return `${environment.rootUrl}/${this.endpoint}`;
  }
  private modeList() {
    return 'mode=list';
  }
}
