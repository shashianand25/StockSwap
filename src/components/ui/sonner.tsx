import { Toaster as Sonner } from "sonner@2.0.3"

export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      toastOptions={{
        style: {
          background: 'white',
          color: 'black',
          border: '1px solid #e5e7eb',
        },
      }}
    />
  )
}
