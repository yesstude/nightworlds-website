import { Button } from "~/components/ui/button";
import { getMe, getMySessions, invalidateSession } from "~/server/api/sessions";

export default async function DashboardHome() {
  const user = await getMe();

  const sessions = await getMySessions();

  return (
    <div>
      <p>Your id is {user!.id}</p>
      <p>You were registered at {user!.registeredAt.toString()}</p>
      <div className="flex flex-col gap-4">
        {sessions.map((s) => (
          <div key={s.id} className="p-4">
            {Object.entries(s).map(([k, v]) => (
              <p key={k}>
                {k}: {JSON.stringify(v)}
              </p>
            ))}
            {/* <p>{s.browser}</p>
            <p>{s.platform}</p>
            <p>{s.regionName}</p>
            <p>{s.useragent}</p>
            <p>{s.loggedAt?.toString() || "never logged"}</p> */}
            <form
              action={async () => {
                "use server";

                await invalidateSession(s.id);
              }}
            >
              <Button variant="outlined" type="submit">
                Deauthorize
              </Button>
            </form>
          </div>
        ))}
      </div>
      <div className="text-lg">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione modi
          doloremque veritatis reiciendis at repellendus odit minima vel
          corrupti quod neque explicabo beatae aliquam optio veniam rerum, nobis
          harum soluta!
        </p>
        <p>
          Alias cupiditate recusandae quaerat eius impedit sunt officia
          quibusdam qui fugiat earum, incidunt nihil culpa minima provident eos
          perspiciatis iusto beatae corporis delectus eum maiores. Earum
          inventore ducimus a explicabo!
        </p>
        <p>
          Eius reiciendis amet minima ab officiis et voluptates autem dolor,
          velit maiores! Deleniti provident animi corrupti, amet eum dolor
          itaque molestiae rerum veritatis quis natus officia eius sed saepe?
          Explicabo.
        </p>
        <p>
          Et aperiam voluptatibus iure rem ex exercitationem voluptates quae
          mollitia unde voluptatem voluptas repudiandae, eligendi eius explicabo
          vitae enim? Qui quas corporis illo perspiciatis soluta laborum
          laudantium distinctio alias quaerat.
        </p>
        <p>
          Inventore odio ipsam tenetur excepturi provident temporibus non, natus
          ad quo placeat cumque asperiores fuga, perferendis, fugit dignissimos
          sed a quam rerum ratione quia harum ut! Laborum nihil explicabo nulla.
        </p>
      </div>
    </div>
  );
}
