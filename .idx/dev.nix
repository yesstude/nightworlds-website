{ pkgs, ... }: {

  channel = "stable-23.11";
  services.docker.enable = true;

  packages = [
    pkgs.openssl
    pkgs.zip
    pkgs.bun
  ];

  env = { };

  idx.workspace.onCreate = {
    npm-install = "bun install";
    create-env = "cp .env.example .env";
  };
  idx.workspace.onStart = {
    start-db = "./start-database.sh";
  };

  idx.extensions = [
    "anilkumarum.compile-ts"
    "esbenp.prettier-vscode"
    "yoavbls.pretty-ts-errors"
    "ms-azuretools.vscode-docker"
    "bradlc.vscode-tailwindcss"
    "Prisma.prisma"
  ]; 

  # idx.previews = {
  #   enable = false;
  #   previews = {
  #     web = {
  #       command = [ "bun" "run" "dev" "--" "--port" "$PORT" ];
  #       manager = "web"; 
  #     };
  #   };
  # };
}
