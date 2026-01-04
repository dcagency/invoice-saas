'use client'

interface Client {
  id: string
  companyName: string
  contactName: string | null
  email: string | null
  city: string | null
}

interface ClientsTableProps {
  clients: Client[]
  onEdit: (clientId: string) => void
  onDelete: (clientId: string, clientName: string) => void
}

export default function ClientsTable({
  clients,
  onEdit,
  onDelete,
}: ClientsTableProps) {
  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden rounded-lg border border-border shadow-sm">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider sm:pl-6"
              >
                Company Name
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Contact Person
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                City
              </th>
              <th scope="col" className="relative px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-muted/30 transition-colors duration-150">
                <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-foreground sm:pl-6">
                  {client.companyName}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">
                  {client.contactName || '-'}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">
                  {client.email || '-'}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">
                  {client.city || '-'}
                </td>
                <td className="relative whitespace-nowrap px-4 py-4 text-right text-sm font-medium sm:pr-6">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(client.id)}
                      className="text-primary hover:text-primary-hover transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(client.id, client.companyName)}
                      className="text-error hover:text-error/80 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {clients.map((client) => (
          <div
            key={client.id}
            className="rounded-lg border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-sm font-semibold text-foreground">
                {client.companyName}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(client.id)}
                  className="text-sm text-primary hover:text-primary-hover transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(client.id, client.companyName)}
                  className="text-sm text-error hover:text-error/80 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
            <dl className="grid grid-cols-1 gap-2 text-sm pt-3 border-t border-border">
              {client.contactName && (
                <div>
                  <dt className="text-muted-foreground">Contact:</dt>
                  <dd className="text-foreground font-medium">{client.contactName}</dd>
                </div>
              )}
              {client.email && (
                <div>
                  <dt className="text-muted-foreground">Email:</dt>
                  <dd className="text-foreground font-medium">{client.email}</dd>
                </div>
              )}
              {client.city && (
                <div>
                  <dt className="text-muted-foreground">City:</dt>
                  <dd className="text-foreground font-medium">{client.city}</dd>
                </div>
              )}
            </dl>
          </div>
        ))}
      </div>
    </>
  )
}


