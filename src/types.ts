import { ApexOptions } from "apexcharts";

export interface Data {
  id: number;
  name: string;
  unit: string;
  comments: string;
  created_at: string;
  updated_at: string;
  hotel: {
    id: number;
    name: string;
    shortname: string;
  };
  desk: {
    id: number;
    name: string;
  };
  fulfilled_by: {
    id: number;
    username: string;
  };
  error?: {
    message?: string;
  };
}

interface Series {
  name: string;
  data: number[];
}

export interface ChartType {
  series: Series[];
  options: ApexOptions;
}
export class Person {
  constructor(public name: string = "", public requests: number = 0) {
    this.name = name;
    this.requests = requests;
  }
}

interface HotelCount {
  name: string;
  count: number;
}

export interface Hotel {
  [id: number]: HotelCount;
}
