import { Dispatch, SetStateAction } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from './alert-dialog'
import { Button } from './button'

interface Props {
    openLogoutDialog: boolean,
    setOpenLogoutDialog: Dispatch<SetStateAction<boolean>>,
    signout: () => void
}

function LogoutDialog(props : Props) {
  return (
    <AlertDialog open={props.openLogoutDialog} onOpenChange={() => props.setOpenLogoutDialog(false)}>
        <AlertDialogContent className='bg-white'>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to Sign out?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button variant="secondary">Cancel</Button>
                </AlertDialogCancel>
                <AlertDialogAction onClick={() => props.signout()}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default LogoutDialog