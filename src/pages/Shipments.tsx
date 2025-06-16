import ShipmentsTable from "@/components/shipments/ShipmentsTable"

function Shipments() {
  return (
    <div className="flex flex-col p-4 gap-3 md:p-4 w-full h-screen overflow-y-scroll md:pb-20 bg-slate-100">
      <div className="flex flex-row items-center justify-between">
        <div>
            <h1 className="text-xl font-semibold">Shipments</h1>
            <p className="text-xs text-slate-400">Manage and track all shipments</p>
        </div>
      </div>
      <div>
        <ShipmentsTable/>
      </div>
    </div>
  )
}

export default Shipments