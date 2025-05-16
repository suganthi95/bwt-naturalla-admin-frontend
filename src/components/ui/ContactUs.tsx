import { Button } from "./button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./dialog"
import { Input } from "./input"

function ContactUs() {
  return (
    <Dialog>
        <DialogTrigger className="w-full">
            <Button size="lg" className="w-full dark:bg-primary hover:dark:bg-primary/80 dark:text-white">Contact Us</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Interested in Enterprise plan?</DialogTitle>
            <DialogDescription>
                <form className="space-y-4 mt-5" action="https://formsubmit.co/support@embrais.com" method="POST">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div>
                            <label htmlFor="firstname">First Name</label>
                            <Input 
                                id="firstname"
                                required
                                name="firstname"
                                type="text" 
                                placeholder="" 
                            />
                        </div>

                        <div>
                            <label htmlFor="lastname">Last Name</label>
                            <Input 
                                id="lastname"
                                required
                                type="text" 
                                name="lastname"
                                placeholder="" 
                            />
                        </div>
                      
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                      <div>
                        <label htmlFor="email">Email</label>
                        <Input 
                            id="email"
                            required
                            type="email" 
                            name="email"
                            placeholder="" 
                        />
                      </div>

                      <div>
                        <label htmlFor="phone">Phone Number</label>
                        <Input 
                            id="phone"
                            required
                            type="text" 
                            name="phone number"
                            placeholder="" 
                        />
                      </div>
                    </div>

                    <div>
                        <label htmlFor="subject">subject</label>
                        <Input 
                            id="subject"
                            required
                            type="text" 
                            name="subject"
                            placeholder={"Write your subject"} 
                        />
                    </div>

                    <div>
                        <label htmlFor="message">Message</label>
                        <Input 
                            id="message"
                            required
                            type="text" 
                            name="message"
                            placeholder={"Write your message"}
                        />
                    </div>

                    <div>
                        <Button type="submit" className="rounded-md w-full">Send</Button>
                    </div>
                </form>
            </DialogDescription>
            </DialogHeader>
        </DialogContent>
    </Dialog>
  )
}

export default ContactUs