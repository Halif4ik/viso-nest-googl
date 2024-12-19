import {ApiProperty} from "@nestjs/swagger";
import {GeneralResponse} from "../interface/generalResponse.interface";

export class RowResponseClass implements GeneralResponse<{ "id": number }> {
   @ApiProperty({example: true})
   success: boolean;

   @ApiProperty({example: null, type: String})
   errors_message: string | null;

   @ApiProperty({example: {id: "1"}})
   data: { "id": number } | null;
}

export class RowExistResponseClass implements GeneralResponse<{ "id": number }> {
   @ApiProperty({example: false})
   success: boolean;

   @ApiProperty({example: "Row with this E-mail already exist in db", type: String})
   errors_message: string | null;

   @ApiProperty({example: null})
   data: { "id": number } | null;
}
