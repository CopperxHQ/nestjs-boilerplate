import { Logger } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';
import Chains from './data/chains';
import { ChainRepository } from 'src/database/repositories/chain.repository';
import { AssetRepository } from 'src/database/repositories/asset.repository';

@Command({ name: 'db:seed', description: 'A parameter parse', options: { isDefault: true } })
export class SeedCommand extends CommandRunner {
  constructor(
    private chainRepository: ChainRepository,
    private assetRepository: AssetRepository
  ) {
    super();
  }

  async run(): Promise<void> {
    const chains = Chains;
    for (const c of chains) {
      const chain = await this.chainRepository.upsert(c, ['type', 'chainId']);
      const chainId = chain.generatedMaps[0].id;

      for (const asset of c.assets) {
        asset.chainId = chainId;
      }

      await this.assetRepository.upsert(c.assets, ['chainId', 'address']);

      Logger.log(`Chain ${c.name} with ${c.assets.length} asset(s) seeded successfully.`);
    }

    Logger.log('All chains seeded successfully.');
  }
}
