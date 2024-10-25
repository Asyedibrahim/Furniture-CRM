import { useState, useEffect } from "react";

export default function Report() {
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [monthlyData, setMonthlyData] = useState([]);
    const [yearlyData, setYearlyData] = useState([]);
    const [chooseReport, setChooseReport] = useState('');

    const fetchMonthlyData = async () => {
        try {
            const res = await fetch(`/api/report/monthly-purchases?month=${month}&year=${year}`);
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await res.json();
            setMonthlyData(data);
        } catch (error) {
            console.error("Error fetching monthly data:", error);
            setMonthlyData([]);
        }
    };

    const fetchYearlyData = async () => {
        try {
            const response = await fetch(`/api/report/yearly-purchases?year=${year}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setYearlyData(result);
        } catch (error) {
            console.error("Error fetching yearly data:", error);
            setYearlyData([]);
        }
    };

    useEffect(() => {
        if (month && year) {
            fetchMonthlyData();
        }
    }, [month, year]);

    useEffect(() => {
        if (year) {
            fetchYearlyData();
        }
    }, [year]);

    return (
        <div className="p-6 bg-white rounded-lg sm:shadow w-full">
            <h2 className="text-2xl font-bold mb-6">Reports</h2>

            <select name="Choose Report" id="report" onClick={(e) => setChooseReport(e.target.value)} className="border px-4 py-2 rounded mb-4">
                <option value="">Select option</option>
                <option value='monthly'>Monthly Report</option>
                <option value='yearly'>Yearly Report</option>
            </select>

            {/* Month/Year Inputs */}
            {chooseReport && (
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <input
                        type="number"
                        placeholder="Year"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="border px-4 py-2 rounded "
                    />
                    {chooseReport === 'monthly' && (
                        <select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="border px-4 py-2 rounded "
                        >
                            <option value="">Select Month</option>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            )}

            {/* Monthly Report Table */}
            {chooseReport === 'monthly' && (
                <>
                    <h3 className="text-xl font-semibold mb-2">Monthly Report</h3>
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full text-sm text-left mb-6">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Customer Name</th>
                                    <th className="px-6 py-3">Customer Number</th>
                                    <th className="px-6 py-3">Purchase Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(monthlyData) && monthlyData.map((item) => (
                                    <tr key={item.id} className="bg-white border-b">
                                        <td className="px-6 py-4">{item.name}</td>
                                        <td className="px-6 py-4">{item.phone}</td>
                                        <td className="px-6 py-4">{item.purchase_count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Yearly Report Table */}
            {chooseReport === 'yearly' && (
                <>
                    <h3 className="text-xl font-semibold mb-2">Yearly Report</h3>
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Customer Name</th>
                                    <th className="px-6 py-3">Customer Number</th>
                                    <th className="px-6 py-3">Purchase Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(yearlyData) && yearlyData.map((item) => (
                                    <tr key={item.id} className="bg-white border-b">
                                        <td className="px-6 py-4">{item.name}</td>
                                        <td className="px-6 py-4">{item.phone}</td>
                                        <td className="px-6 py-4">{item.purchase_count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Centered message for no report selected */}
            {!chooseReport && (
                <div className="mt-20 text-center">
                    <h2 className="text-2xl font-semibold text-gray-400">Please select Monthly or Yearly Report</h2>
                </div>
            )}
        </div>
    );
}
