import AppDialog from "@crema/core/AppDialog";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";

interface DialogProps {
  infoDialog: any;
  setInfoDialog: any;
  type?: any;
}

const DonationSlugs: React.FC<DialogProps> = ({
  infoDialog,
  setInfoDialog,
  type,
}) => {
  return (
    <AppDialog
      fullHeight
      maxWidth={"lg"}
      open={infoDialog}
      onClose={() => setInfoDialog(false)}
    >
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Slug Name</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{`{{ donor_name }}`}</TableCell>
              <TableCell>
                Who has donated to your request. Name of the Donor
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{`{{ ngo_name }}`}</TableCell>
              <TableCell>
                It's displayed a name of NGO/Donator to which you have donated.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{`{{ ngo_address }}`}</TableCell>
              <TableCell>
                Address of the NGO/Donator you have donated to.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{`{{ ngo_phone }}`}</TableCell>
              <TableCell>
                Phone No. of the NGO/Donator you have donated to.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{`{{ reciept_id }}`}</TableCell>
              <TableCell>
                Particular Receipt Number. Receipt ID generates automatically.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{`{{ tax_id }}`}</TableCell>
              <TableCell>The tax number you entered while donating.</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{`{{ request_id }}`}</TableCell>
              <TableCell>
                Particular request number. It’s generated automatically.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{`{{ receipt_date }}`}</TableCell>
              <TableCell>
                The day when receipt is downloaded or shared.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{`{{ created_at }}`}</TableCell>
              <TableCell>The date you donated to the Request.</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{`{{ payment_method }}`}</TableCell>
              <TableCell>
                Which you use for donation. like card, GPay, UPI etc...
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{`{{ amount_paid }}`}</TableCell>
              <TableCell>
                The amount you have donated. (Depend on include or Excluded
                charges)
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{`{{ amount_in_words }}`}</TableCell>
              <TableCell>
                The amount you have donated is displayed in words. (Depend on
                include or Excluded charges)
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{`{{ service_fee }}`}</TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{`{{ transaction_fee }}`}</TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{`{{ manage_fees }}`}</TableCell>
              <TableCell>
                It displays a include or Excluded charge for which amount you
                have donated.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{`{{ total_amount }}`}</TableCell>
              <TableCell>The total amount you have donated.</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{`{{ total_amount_in_words }}`}</TableCell>
              <TableCell>
                The amount you have donated is displayed in words.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{`{{ note }}`}</TableCell>
              <TableCell>
                It is displayed a Note you entered while donating.
              </TableCell>
            </TableRow>
            {type === "single-receipt-template" && (
              <>
                {/* not in donation to NGO */}
                <TableRow>
                  <TableCell>{`{{ goal_amount }}`}</TableCell>
                  <TableCell>
                    It is displayed a actual amount of the request. which they
                    need.
                  </TableCell>
                </TableRow>
                {/* not in donation to NGO */}
                <TableRow>
                  <TableCell>{`{{ fundraiser_name }}`}</TableCell>
                  <TableCell>
                    It is displayed the title name of the request.
                  </TableCell>
                </TableRow>
              </>
            )}
            <TableRow>
              <TableCell>{`{{ saayam_number }}`}</TableCell>
              <TableCell>It's display a Saayam number.</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{`{{ saayam_mail }}`}</TableCell>
              <TableCell>It's display a Saayam mail id.</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </AppDialog>
  );
};

export default DonationSlugs;
