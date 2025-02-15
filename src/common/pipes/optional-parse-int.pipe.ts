import { ArgumentMetadata, ParseIntPipe } from '@nestjs/common'
import { ParseIntPipeOptions } from '@nestjs/common/pipes/parse-int.pipe'

export class OptionalParseIntPipe {
  private readonly parseIntPipe: ParseIntPipe

  constructor(options?: ParseIntPipeOptions) {
    this.parseIntPipe = new ParseIntPipe(options)
  }

  public async transform(
    value: string | undefined,
    metadata: ArgumentMetadata,
  ): Promise<number | undefined> {
    if (value === undefined || value === '' || Number.isNaN(value)) {
      return undefined
    }
    return this.parseIntPipe.transform(value, metadata)
  }
}
