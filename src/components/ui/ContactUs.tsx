import { Trans } from "react-i18next"
import { Button } from "./button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./dialog"
import { Input } from "./input"

function ContactUs() {
  return (
    <Dialog>
        <DialogTrigger className="w-full">
            <Button size="lg" className="w-full dark:bg-primary hover:dark:bg-primary/80 dark:text-white"><Trans i18nKey={'contactUs'}/></Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle><Trans i18nKey={'interested'}/></DialogTitle>
            <DialogDescription>
                <form className="space-y-4 mt-5" action="https://formsubmit.co/support@embrais.com" method="POST">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div>
                            <label htmlFor="firstname"><Trans i18nKey={'first_name'}/></label>
                            <Input 
                                id="firstname"
                                required
                                name="firstname"
                                type="text" 
                                placeholder="" 
                            />
                        </div>

                        <div>
                            <label htmlFor="lastname"><Trans i18nKey={'last_name'}/></label>
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
                        <label htmlFor="email"><Trans i18nKey={'email'}/></label>
                        <Input 
                            id="email"
                            required
                            type="email" 
                            name="email"
                            placeholder="" 
                        />
                      </div>

                      <div>
                        <label htmlFor="phone"><Trans i18nKey={'phone'}/></label>
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
                        <label htmlFor="subject"><Trans i18nKey={'subject'}/></label>
                        <Input 
                            id="subject"
                            required
                            type="text" 
                            name="subject"
                            // placeholder={"Write your subject"} 
                        />
                    </div>

                    <div>
                        <label htmlFor="message"><Trans i18nKey={'message'}/></label>
                        <Input 
                            id="message"
                            required
                            type="text" 
                            name="message"
                        />
                    </div>

                    <div>
                        <Button type="submit" className="rounded-md w-full"><Trans i18nKey={'send'}/></Button>
                    </div>
                </form>
            </DialogDescription>
            </DialogHeader>
        </DialogContent>
    </Dialog>
  )
}

export default ContactUs