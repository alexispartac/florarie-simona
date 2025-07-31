'use client';
import React from "react";
import router from "next/router";
import axios from "axios";

const ClosePeriod = () => {
    const [closePeriod, setClosePeriod] = React.useState(null);
    const getClosePeriod = React.useCallback(async () => {
      try {
        const response = await axios.get("/api/close-period");
        const data = response.data;
        setClosePeriod(data.closePeriod);
      } catch (error) {
        console.log("Error fetching close period:", error);
      }
  
      if (closePeriod) {
        const currentDate = new Date();
        const closeDate = new Date(closePeriod);
        
        if (currentDate < closeDate) {
          return router.push({
            pathname: "/close-period",
            query: { closePeriod },
          });
        }
      }
    }, [closePeriod]);
  
    React.useEffect(() => {
      getClosePeriod();
    }, [getClosePeriod]);
    
}

export default ClosePeriod;




