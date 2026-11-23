import useAdminResource from "./useAdminResource";
import { DeleteButton, PanelState } from "./PanelState";
import { formatDate } from "../api";

export default function Messages() {
  const { records, error, isLoading, remove } = useAdminResource("contacts");

  return (
    <div>
      <div className="panel-heading">
        <h2>Messages</h2>
        {!isLoading && !error && <span className="count">{records.length} total</span>}
      </div>
      <PanelState
        isLoading={isLoading}
        error={error}
        isEmpty={records.length === 0}
        emptyText="No messages yet. Submissions from the contact form will appear here."
      />
      <ul className="record-list">
        {records.map(message => {
          const name = `${message.firstname} ${message.lastname}`;
          return (
            <li key={message._id} className="card record">
              <div className="record-header">
                <div>
                  <h3>{name}</h3>
                  <p className="record-meta">
                    <a className="contact-email" href={`mailto:${message.email}`}>{message.email}</a>
                    {message.phone && <> · {message.phone}</>}
                    {message.createdAt && <> · {formatDate(message.createdAt)}</>}
                  </p>
                </div>
                <DeleteButton label={`message from ${name}`} onDelete={() => remove(message._id)} />
              </div>
              <p className="record-body">{message.message}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
