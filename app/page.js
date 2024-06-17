import Datepicker from "./components/Datepicker"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Datepicker label="Select Date Range" />
    </main>
  );
}
