import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"


function Feedback() {

  return (
    <div className="flex flex-col flex-1 px-3">
        <div className="flex flex-row items-center justify-between py-1">
            <h1 className="font-semibold">Feedback</h1>
        </div>

        <form className="mt-3 font-medium text-secondary space-y-5">
            <div className="space-y-1">
                <label className="text-sm" htmlFor="">Feedback Type</label>
                <Select>
                    <SelectTrigger className="w-1/2">
                        <SelectValue placeholder="Please select feedback type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Report a Bug</SelectItem>
                        <SelectItem value="highest_rating">Request a Feature</SelectItem>
                        <SelectItem value="lowest_rating">Appreciation feedback</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-1">
                <label className="text-sm" htmlFor="">Message</label>
                <Textarea required className="w-1/2" rows={5} placeholder="Type your message here." />
            </div>

            <div className="space-y-1">
            <label className="text-sm" htmlFor="">Upload Files</label>
                <label htmlFor="dropzone-file" className="flex flex-col w-1/2 border-2 border-primary border-dashed rounded-lg cursor-pointer bg-primary/5 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-primary/10 dark:border-gray-600 dark:hover:border-gray-500">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" />
                </label>
            </div>

            <div className="py-2">
                <Button className="bg-primary hover:bg-primary/50">Send</Button>
            </div>
        </form>
    </div>
  )
}

export default Feedback