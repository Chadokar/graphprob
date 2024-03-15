import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { ChartType, Data, Person } from "./types";
import ReactApexCharts from "react-apexcharts";

const Graph = () => {
  const fetchData = async (): Promise<Data[]> => {
    return await axios
      .get("/int/requests")
      .then((res) => {
        return res.data?.requests;
      })
      .catch((error) => {
        return error;
      });
  };

  const {
    data: hotelData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["data"],
    queryFn: fetchData,
    refetchOnWindowFocus: false,
  });

  const [chartData, setChartData] = React.useState<ChartType>({
    series: [],
    options: {
      chart: {
        type: "line",
        zoom: {
          enabled: false,
        },
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
      yaxis: {
        min: 0,
        max: 8,
        stepSize: 2,
      },
    },
  });

  React.useEffect(() => {
    // I can use array also but I am using Map as the id can be a large number  and it will be better to use Map
    const dataMap = new Map<number, Person>();
    hotelData?.forEach((data) => {
      const currentValue: Person | undefined = dataMap.get(data.hotel.id);
      if (currentValue) {
        currentValue.requests++;
      } else {
        dataMap.set(data.hotel.id, new Person(data.hotel.name, 1));
        // we can also use the below line to set the value
        // dataMap.set(data.hotel.id, {name: data.hotel.name, requests: 1});
      }
    });
    // Intead of Map I can also form an object of objects which also works like a Map /*below code*/
    /* const hotelRequests: Hotel | undefined = hotelData?.reduce(
      (hotelreq: Hotel, request: Data) => {
        const hotelName = request.hotel.name;
        const hotelId = request.hotel.id;
        hotelreq[hotelId] = {
          name: hotelName,
          count: (hotelreq[hotelId]?.count || 0) + 1,
        };
        return hotelreq;
      },
      {}
    ); */
    setChartData((preData) => ({
      series: [
        {
          name: "Requests",
          data: Array.from(dataMap, ([key, value]) => value["requests"]),
          // for object of objects
          //   data: Object.values(hotelRequests || {}).map((hotel) => hotel.count),
        },
      ],
      options: {
        ...preData.options,
        xaxis: {
          categories: Array.from(dataMap, ([key, value]) => value["name"]),
          // for object of objects
          //   categories: Object.values(hotelRequests || {}).map(
          //     (hotel) => hotel.name
          //   ),
        },
      },
    }));
  }, [hotelData]);

  // we can use error and loading feature better UI but you have not mentioned it so I am not using it

  if (error) return <h1>{error?.message}</h1>;
  if (isLoading) return <h1>Loading...</h1>;

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

export default Graph;

// explaination
/*
1. I have used react-query to fetch the data from the server.
2. I have used Map to store the data as the id can be a large number and it will be better to use Map.
3. I have used the useEffect hook to update the dataMap and the chartData when the hotelData changes.
4. I have shown the optional in which used the reduce method to form an object of objects which also works like a Map.
5. I have used the Array.from method to convert the Map to an array of objects.
Here the Map and Object both method has its own advantages and disadvantages. The Map is faster and better for large dataset than the Object method but the Object method is more readable and easy to use.
*/
