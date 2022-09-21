import { useState, useEffect, useRef } from 'react';
import { useApi } from '../contexts/ApiProvider';
import { useLocation, useOutletContext } from 'react-router-dom';

import Form from 'react-bootstrap/Form';

import InputField from './form/InputField';
import Loader from './loaders/Loader';

function ProjectDetailForm() {
  const [request_url, request_id, handleSubmit, handleBlur, handleInputChange, formErrors,] = useOutletContext();
  const location = useLocation();
  const [detail, setDetail] = useState();
  const api = useApi();
  //const url = endpoint + '/project_details'
  //const url = endpoint
  const url = request_url + '/project_details'

  const formatter = new Intl.NumberFormat('en-US');
  const amountRequested = useRef();

  const handleCurrencyFormat = (event) => {
    const parsed_value = parseInt(event.target.value.replace(/,/g, ''));
    const formatted_value = formatter.format(parsed_value);
    console.log(isNaN(parsed_value))
    event.target.value = !isNaN(parsed_value) ? formatted_value : '';
  };

  useEffect(() => {
    (async () => {
      const response = await api.get(url);
      setDetail(response.ok ? response.body : null);
    })();
  }, [api, url]);

  return (
    <>
      {detail ?  
        <Form onSubmit={handleSubmit}>
    
          <InputField
            name="ProjectAmountRequested"
            label="$ Requested"
            defaultValue={formatter.format(detail.ProjectAmountRequested)}
            changeHandler={handleInputChange}
            keyUpHandler={handleCurrencyFormat}
            fieldRef={amountRequested}
            helperText="Amount requested by the personal office. Appears in tables and reports."
            blurHandler={handleBlur} 
            error={formErrors.ProjectAmountRequested} />
          <InputField
            name="ChamberAmount"
            label="$ Funded (House/Senate)"
            defaultValue={formatter.format(detail.ChamberAmount)}
            changeHandler={handleInputChange}
            keyUpHandler={handleCurrencyFormat}
            helperText="Amount funded in House or Senate bill. Appears in tables and reports."
            blurHandler={handleBlur} 
            error={formErrors.ChamberAmount} />
          <InputField
            name="ChamberInternalAmount"
            label="Draft $ Funded (House/Senate)"
            defaultValue={formatter.format(detail.ChamberInternalAmount)}
            changeHandler={handleInputChange}
            keyUpHandler={handleCurrencyFormat}
            helperText="Nominal/draft amount to fund the CPF. Will NOT appear in tables or reports."
            error={formErrors.ChamberInternalAmount}
            blurHandler={handleBlur} />
          <InputField
            name="FinalAmount"
            label="$ Funded (Conference)"
            defaultValue={formatter.format(detail.FinalAmount)}
            changeHandler={handleInputChange}
            keyUpHandler={handleCurrencyFormat}
            helperText="Amount funded in the Conference bill. Appears in tables and reports."
            blurHandler={handleBlur} 
            error={formErrors.ChamberAmount} />
          <InputField
            name="ConferenceInternalAmount"
            label="Draft $ Funded (Conference)"
            defaultValue={formatter.format(detail.ConferenceInternalAmount)}
            changeHandler={handleInputChange}
            keyUpHandler={handleCurrencyFormat}
            helperText="Conference nominal/draft amount. Will NOT appear in tables or reports."
            error={formErrors.ConferenceInternalAmount}
            blurHandler={handleBlur} />
          <InputField
            name="PresidentBudgetAmount"
            label="$ President's Budget Requested Amount"
            defaultValue={formatter.format(detail.PresidentBudgetAmount)}
            changeHandler={handleInputChange}
            keyUpHandler={handleCurrencyFormat}
            helperText="Funding requested in the President's Budget for the project."
            error={formErrors.PresidentBudgetAmount}
            blurHandler={handleBlur} />
           <InputField
            name="TotalProjectCost"
            label="$ Total Project Cost"
            defaultValue={formatter.format(detail.TotalProjectCost)}
            changeHandler={handleInputChange}
            keyUpHandler={handleCurrencyFormat}
            helperText="Total cost to complete the project."
            blurHandler={handleBlur} 
            error={formErrors.TotalProjectCost} />         
          <InputField
            name="PriorFYEnactedAmount"
            label="$ Funded (Prior FY Enacted)"
            defaultValue={formatter.format(detail.PriorFYEnactedAmount)}
            changeHandler={handleInputChange}
            keyUpHandler={handleCurrencyFormat}
            helperText="Funding provided for the project in the prior fiscal year's enacted bill (if applicable)."
            blurHandler={handleBlur} 
            error={formErrors.PriorFYEnactedAmount} />
          <InputField
            name="Explanation"
            label="Project Explanation"
            as_type="textarea"
            defaultValue={detail.Explanation}
            changeHandler={handleInputChange}
            helperText="Personal office rationale for providing the project with taxpayer funds."
            blurHandler={handleBlur}
            error={formErrors.Explanation}  />
          <InputField
            name="ProjectLegalName"
            label="Project Legal Name"
            defaultValue={detail.ProjectLegalName}
            changeHandler={handleInputChange}
            helperText="Legal name/title of the project."
            blurHandler={handleBlur} 
            error={formErrors.ProjectLegalName} />
        </Form>
        :
        <Loader obj={detail} />
      }
    </>
  );
}

export default ProjectDetailForm;
