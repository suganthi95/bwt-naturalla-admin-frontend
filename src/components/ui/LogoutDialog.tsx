import { Dispatch, SetStateAction } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from './alert-dialog'
import { Button } from './button'
import { Trans } from 'react-i18next'

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
            <AlertDialogTitle><Trans i18nKey={'signout_confirmation'}/></AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button variant="secondary"><Trans i18nKey={'cancel'}/></Button>
                </AlertDialogCancel>
                <AlertDialogAction onClick={() => props.signout()}><Trans i18nKey={'continue'}/></AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default LogoutDialog