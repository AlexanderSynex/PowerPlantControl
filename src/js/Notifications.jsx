import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { Snackbar } from '@mui/material'

{/* Popup. Успешное открытие */}
export function CrateOpenNotification({open, onClickClose}) {
  return (<Snackbar open={open} autoHideDuration={6000} onClose={onClickClose}>
      <Alert severity="success" color="warning" onClose={onClickClose}>
        <AlertTitle>Ячейка открыта</AlertTitle>
          Не забудьте закрыть ячейку
      </Alert>
  </Snackbar>)
}


{/* Popup. Информация об авторизации */} 
export function NewUserNotification({open, onClickClose, clientId})
{     
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClickClose}
      message={`Авторизированы как Пользователь ${clientId}`}
    />)
}

{/* Alert. Незакрытые ячейки */}
export function CloseDoorNotification({open, onClickClose, doors}) {
  return (
    <Snackbar
      open={open}
      onClose={onClickClose}
    >
      <Alert severity="warning" color="error">
        <AlertTitle>Закройте дверцы</AlertTitle>
          Ячейки <b>{doors.map((indexId) => (indexId + 1)).join(', ')}</b> не были закрыты
      </Alert>
    </Snackbar>
  )
}


{/* Popup. Ошибка открытия забронированной ячейки */}
export function ReservedOpenFailureNotification({open, onClickClose}) {
  return (<Snackbar open={open} autoHideDuration={6000} onClose={onClickClose}>
      <Alert severity="error" onClose={onClickClose}>
        <AlertTitle>Ячейка не может быть открыта</AlertTitle>
          Аккумулятор забронирован другим пользователем
      </Alert>
  </Snackbar>)
}


{/* Popup. Потеряно соединение */}
export function ConnectionLostNotification({open}) {
  return (<Snackbar open={open}>
      <Alert severity="error">
        <AlertTitle>Потеряно соединение с сервером</AlertTitle>
          Пытаемся восстановить подключение
      </Alert>
  </Snackbar>)
}