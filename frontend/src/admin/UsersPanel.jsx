import useAdminResource from "./useAdminResource";
import { DeleteButton, PanelState } from "./PanelState";
import { useAuth } from "../auth/AuthContext";
import { formatDate } from "../api";

export default function UsersPanel() {
  const { user: currentUser } = useAuth();
  const { records, error, isLoading, remove } = useAdminResource("users");

  return (
    <div>
      <div className="panel-heading">
        <h2>Users</h2>
        {!isLoading && !error && <span className="count">{records.length} total</span>}
      </div>
      <PanelState isLoading={isLoading} error={error} isEmpty={records.length === 0} emptyText="No users yet." />
      {records.length > 0 && (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Joined</th>
                <th scope="col"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {records.map(record => {
                const isSelf = record._id === currentUser._id;
                return (
                  <tr key={record._id}>
                    <td>{record.name}{isSelf && <span className="you-label"> (you)</span>}</td>
                    <td>{record.email}</td>
                    <td><span className={`role-badge${record.role === "admin" ? " admin" : ""}`}>{record.role}</span></td>
                    <td>{formatDate(record.created)}</td>
                    <td className="cell-actions">
                      {isSelf ? (
                        <span className="field-hint">Manage from your profile</span>
                      ) : (
                        <DeleteButton label={`user ${record.name}`} onDelete={() => remove(record._id)} />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
