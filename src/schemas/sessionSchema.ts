import { z } from "zod";

export const vehicleRecordSchema = z
  .object({
    empcodigo: z.string(),
    veiccodigo: z.string(),
    veicnome: z.string(),
    veicnumseriebtq: z.string(),
    veicestop: z.string(),
    ueid: z.string(),
    veicorigemrastnome: z.string(),
    veiccatid: z.string(),
    veicgrpcodigo: z.string(),
    veicgrpnome: z.string(),
    veicidp: z.string(),
    veicdvrativo: z.string(),
    veicbipdesligado: z.string(),
    veicprefixo: z.string(),
    veicplaca: z.string(),
    vtevalkmvalor: z.string(),
    veicvalkmrodado: z.string(),
    veicgrpvalkmrodado: z.string(),
    veicamort: z.string(),
    veicvelpadrao: z.string(),
    veiclocacao: z.string(),
    veicmonitriipcadaut: z.string(),
    veicorigemrastonline: z.string(),
    veicnomeprefixo: z.string().optional(),
  })
  .catchall(z.unknown());

export const packageTypeRecordSchema = z
  .object({
    pcttcodigo: z.string(),
    pcttnomeresumido: z.string(),
  })
  .catchall(z.unknown());

export const silentSessionBackendResponseSchema = z.object({
  token: z.string().min(1),
  veiculos: z.array(vehicleRecordSchema),
  tipospacote: z.array(packageTypeRecordSchema),
});

export const silentSessionResponseSchema = z.object({
  jwtToken: z.string().min(1),
  tokenExp: z.number(),
  vehicles: z.array(vehicleRecordSchema),
  packageTypes: z.array(packageTypeRecordSchema),
});
