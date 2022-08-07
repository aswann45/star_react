import { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiProvider';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import InputField from '../components/InputField';
import { useLocation } from 'react-router-dom';
import Loader from '../components/Loader';

function ProjectDetailForm({ handleSubmit, handleBlur, handleInputChange, formErrors }) {
  const location = useLocation();
  const [detail, setDetail] = useState();
  const api = useApi();
  const url = location.pathname;

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
            defaultValue={detail.ProjectAmountRequested}
            changeHandler={handleInputChange}
            helperText="Amount requested by the personal office. Appears in tables and reports."
            blurHandler={handleBlur} 
            error={formErrors.ProjectAmountRequested} />
          <InputField
            name="ChamberAmount"
            label="$ Funded (House/Senate)"
            defaultValue={detail.ChamberAmount}
            changeHandler={handleInputChange}
            helperText="Amount funded in House or Senate bill. Appears in tables and reports."
            blurHandler={handleBlur} 
            error={formErrors.ChamberAmount} />
          <InputField
            name="ChamberAmountInternal"
            label="Draft $ Funded (House/Senate)"
            defaultValue={detail.ChamberInternalAmount}
            changeHandler={handleInputChange}
            helperText="Nominal/draft amount to fund the CPF. Will NOT appear in tables or reports."
            error={formErrors.ChamberInternalAmount}
            blurHandler={handleBlur} />
          <InputField
            name="FinalAmount"
            label="$ Funded (Conference)"
            defaultValue={detail.FinalAmount}
            changeHandler={handleInputChange}
            helperText="Amount funded in the Conference bill. Appears in tables and reports."
            blurHandler={handleBlur} 
            error={formErrors.ChamberAmount} />
          <InputField
            name="ConferenceAmountInternal"
            label="Draft $ Funded (Conference)"
            defaultValue={detail.ConferenceInternalAmount}
            changeHandler={handleInputChange}
            helperText="Conference nominal/draft amount. Will NOT appear in tables or reports."
            error={formErrors.ConferenceInternalAmount}
            blurHandler={handleBlur} />
          <InputField
            name="PresidentBudgetAmount"
            label="$ President's Budget Requested Amount"
            defaultValue={detail.PresidentBudgetAmount}
            changeHandler={handleInputChange}
            helperText="Funding requested in the President's Budget for the project."
            error={formErrors.PresidentBudgetAmount}
            blurHandler={handleBlur} />
          <InputField
            name="PriorFYEnactedAmount"
            label="$ Funded (Prior FY Enacted)"
            defaultValue={detail.PriorFYEnactedAmount}
            changeHandler={handleInputChange}
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
