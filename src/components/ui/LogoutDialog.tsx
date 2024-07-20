import { Dispatch, SetStateAction } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './alert-dialog'

interface Props {
    openLogoutDialog: boolean,
    setOpenLogoutDialog: Dispatch<SetStateAction<boolean>>,
    signout: () => void
}

function LogoutDialog(props : Props) {
  return (
    <AlertDialog open={props.openLogoutDialog} onOpenChange={() => props.setOpenLogoutDialog(false)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Do you wanna Sign out?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => props.signout()}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default LogoutDialog