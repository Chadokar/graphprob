import axios from "axios";
import React from "react";
import { ChartType } from "./types";
import ReactApexCharts from "react-apexcharts";

interface HotelRequestsCount {
  [hotelName: string]: number;
}

const Chart = () => {
  const apiEndpoint = "https://checkinn.co/api/v1/int/requests";
  const [apiData, setApiData] = React.useState([]);
  const [chartData, setChartData] = React.useState<ChartType>({
    series: [],
    options: {
      chart: {
        type: "line",
        height: 350,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [],
      },
      title: {
        text: "Requests per Hotel",
        align: "center",
      },
    },
  });

  React.useEffect(() => {
    axios
      .get(apiEndpoint)
      .then((res) => {
        let requests = res.data?.requests ?? [];

        setApiData(requests);

        const hotelRequestCounts: HotelRequestsCount = requests.reduce(
          (acc: HotelRequestsCount, request: any) => {
            // console.log("acc : ", acc);
            const hotelName = request.hotel.name;
            acc[hotelName] = (acc[hotelName] || 0) + 1;
            return acc;
          },
          {}
        );
        console.log("hotelRequestCounts : ", hotelRequestCounts);

        const categories = Object.keys(hotelRequestCounts);
        const seriesData: number[] = Object.values(hotelRequestCounts);

        setChartData((prevData) => ({
          ...prevData,
          series: [{ name: "Requests", data: seriesData }],
          options: {
            ...prevData.options,
            xaxis: { ...prevData.options.xaxis, categories },
          },
        }));
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="graph">
      <ReactApexCharts
        options={chartData.options}
        series={chartData.series}
        type="line"
        height={350}
        width={800}
      />
    </div>
  );
};

export default Chart;
