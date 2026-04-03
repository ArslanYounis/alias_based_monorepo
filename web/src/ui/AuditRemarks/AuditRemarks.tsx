import React from "react";
import { Buttons } from "../Buttons";
import Document from "@/assets/svg/document";
import SharedLanguageSwitchRenderer from "@/components/shared/SharedLanguageSwitchRenderer";

interface Agent {
  name: string;
  email: string;
  phone: string;
  image: string;
}

interface ApplicationDetail {
  applicationNumber: string;
  applicationDate: string;
  referenceNumber: string;
}

interface Plot {
  plotId?: string;
  plotArgs?: string;
  code: string;
  municipality: string;
  zone: string;
  sector: string;
  address: string;
}

interface Owner {
  ownerId?: string;
  ownerArgs?: string;
  name: string;
  familyBook: string;
  city: string;
  propertyCard: string;
}

interface Documents {
  documentNameA: string;
  documentNameE: string;
  downloadUrl: string;
}

export interface ApprovalModalProps {
  agent: Agent;
  title_ar?: string;
  language?: "en" | "ar";
  applicationDetails: ApplicationDetail[];
  plots: Plot[];
  owners: Owner[];
  documents: Documents[];
  title: string;
  theme?: "light" | "dark";
  onOwnerClick?: (data: {
    ownerData: Owner;
    action: "view" | "edit" | "plot";
  }) => void;
  onPlotClick?: (data: { PlotData: Plot; action: "view" }) => void;
}

export type AuditRemarksProps = {
  value?: string;
  onChange?: (val: string) => void;
  registrationRemarks?: string;
};

const AuditRemarks: React.FC<ApprovalModalProps & AuditRemarksProps> = ({
  agent,
  applicationDetails = [],
  plots = [],
  owners = [],
  documents = [],
  title,
  title_ar = "",
  language = "en",
  value,
  registrationRemarks,
  onChange,
  theme = "dark",
  onOwnerClick,
  onPlotClick,
}) => {
  return (
    <div className="w-full" dir={language === "ar" ? "rtl" : "ltr"}>
      {title && (
        <h1 className={`text-heading-h1 font-bold mb-8 text-text-default`}>
          <SharedLanguageSwitchRenderer
            language={language}
            value={title}
            value_ar={title_ar}
          />
        </h1>
      )}

      <div className="flex flex-col gap-2 mb-8">
        <p className={`text-heading-h4 font-bold text-text-default`}>
          <SharedLanguageSwitchRenderer
            language={language}
            value="Agent"
            value_ar="الوكيل"
          />
        </p>
        <div className="flex gap-m items-center px-s py-xs bg-cards-base-l1 rounded-xxs">
          <img
            src={agent.image || ""}
            alt="agent"
            className="w-8 h-8 rounded-full"
          />
          <div className="flex gap-xs">
            <span className="text-m text-text-default font-normal">
              {agent.name}
            </span>
            <span className="text-m text-text-dimmed font-normal">|</span>
            <span className="text-m text-text-link font-normal">
              {agent.email}
            </span>
            <span className="text-m text-text-dimmed font-normal">|</span>
            <span className="text-m text-text-default font-normal">
              {agent.phone}
            </span>
          </div>
        </div>
      </div>

      <section className="mb-8">
        <h3 className={`text-heading-h3 font-bold mb-4 text-text-default`}>
          <SharedLanguageSwitchRenderer
            language={language}
            value="Auditor Remarks"
            value_ar="ملاحظات المدقق"
          />
        </h3>
        <textarea
          className="w-full rounded-[8px] border border-form-fields-input-form-border bg-form-fields-input-form-bg text-text-default text-m p-m gap-m resize-none focus:outline-none"
          placeholder=""
          rows={3}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        ></textarea>
        <div className="border-b border-text-dimmed mt-8"></div>
      </section>

      <div className="mb-8">
        <p className={`text-heading-h3 font-bold mb-4 text-text-default`}>
          <SharedLanguageSwitchRenderer
            language={language}
            value="Application Details"
            value_ar="تفاصيل الطلب"
          />
        </p>
        <div className="rounded-xs bg-cards-base-l1 border border-cards-stroke px-l py-m space-y-xl text-text-default">
          {applicationDetails?.map((detail, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex gap-s border-b border-text-dimmed pb-s">
                <span className="w-1/2 text-bold-m">
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value="Application Number"
                    value_ar="رقم الطلب"
                  />
                </span>
                <span className="w-1/2 text-m">{detail.applicationNumber}</span>
              </div>
              <div className="flex gap-s border-b border-text-dimmed pb-s">
                <span className="w-1/2 text-bold-m">
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value="Application Date"
                    value_ar="تاريخ الطلب"
                  />
                </span>
                <span className="w-1/2 text-m">{detail.applicationDate}</span>
              </div>
              <div className="flex gap-s pb-s">
                <span className="w-1/2 text-bold-m">
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value="Reference Number"
                    value_ar="رقم المرجع"
                  />
                </span>
                <span className="w-1/2 text-m">{detail.referenceNumber}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <p className={`text-heading-h3 font-bold mb-4 text-text-default`}>
          <SharedLanguageSwitchRenderer
            language={language}
            value="Plot"
            value_ar="قطعة أرض"
          />
        </p>
        {plots?.map((plot, idx) => (
          <div
            key={idx}
            className="rounded-[8px] bg-cards-base-l1 text-text-default border border-cards-stroke px-l py-m space-y-xl mb-4"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-bold-ml">{plot.code}</h3>
              <Buttons
                type="secondary"
                theme={theme}
                language={language}
                title={language === "ar" ? "عرض" : "View"}
                title_ar="عرض"
                size="s"
                onClick={() => {
                  onPlotClick?.({ PlotData: plot, action: "view" });
                }}
              />
            </div>
            <div className="space-y-2">
              <div className="flex gap-s border-b border-text-dimmed pb-s">
                <span className="w-1/2 text-bold-m">
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value="Municipality"
                    value_ar="البلدية"
                  />
                </span>
                <span className="w-1/2 text-m">{plot.municipality}</span>
              </div>
              <div className="flex gap-s border-b border-text-dimmed pb-s">
                <span className="w-1/2 text-bold-m">
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value="Zone/District"
                    value_ar="المنطقة / الحي"
                  />
                </span>
                <span className="w-1/2 text-m">{plot.zone}</span>
              </div>
              <div className="flex gap-s border-b border-text-dimmed pb-s">
                <span className="w-1/2 text-bold-m">
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value="Sector"
                    value_ar="القطاع"
                  />
                </span>
                <span className="w-1/2 text-m">{plot.sector}</span>
              </div>
              <div className="flex gap-s pb-s">
                <span className="w-1/2 text-bold-m">
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value="Plot Address"
                    value_ar="عنوان القطعة"
                  />
                </span>
                <span className="w-1/2 text-m">{plot.address}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <p className={`text-heading-h3 font-bold mb-4 text-text-default`}>
          <SharedLanguageSwitchRenderer
            language={language}
            value="Owner"
            value_ar="المالك"
          />
        </p>
        {owners?.map((owner, idx) => (
          <div
            key={idx}
            className="rounded-xs bg-cards-base-l1 border border-cards-stroke text-text-default px-l py-m space-y-xl mb-4"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-bold-ml">{owner.name}</h3>
              <div className="flex gap-s">
                <Buttons
                  type="secondary"
                  theme={theme}
                  language={language}
                  title={language === "ar" ? "عرض" : "View"}
                  title_ar="عرض"
                  size="s"
                  onClick={() => {
                    onOwnerClick?.({ ownerData: owner, action: "view" });
                  }}
                />
                <Buttons
                  type="secondary"
                  theme={theme}
                  language={language}
                  title={language === "ar" ? "تعديل" : "Edit"}
                  title_ar="تعديل"
                  size="s"
                  onClick={() => {
                    onOwnerClick?.({ ownerData: owner, action: "edit" });
                  }}
                />
                <Buttons
                  type="secondary"
                  theme={theme}
                  language={language}
                  title={language === "ar" ? "القطع" : "Plots"}
                  title_ar="القطع"
                  size="s"
                  onClick={() => {
                    onOwnerClick?.({ ownerData: owner, action: "plot" });
                  }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex gap-s border-b border-text-dimmed pb-s">
                <span className="w-1/2 text-bold-m">
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value="Family book"
                    value_ar="دفتر العائلة"
                  />
                </span>
                <span className="w-1/2 text-m">{owner.familyBook}</span>
              </div>
              <div className="flex gap-s border-b border-text-dimmed pb-s">
                <span className="w-1/2 text-bold-m">
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value="City"
                    value_ar="المدينة"
                  />
                </span>
                <span className="w-1/2 text-m">{owner.city}</span>
              </div>
              <div className="flex gap-s pb-s">
                <span className="w-1/2 text-bold-m">
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value="Property Card"
                    value_ar="بطاقة الملكية"
                  />
                </span>
                <span className="w-1/2 text-m">{owner.propertyCard}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`flex flex-col gap-4 text-text-default`}>
        {documents.length > 0 && (
          <>
            <p className="text-heading-h3 font-bold">
              <SharedLanguageSwitchRenderer
                language={language}
                value="Supporting Documents"
                value_ar="المستندات الداعمة"
              />
            </p>
            {documents.map((doc, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center gap-xs px-[15px] py-[13px] rounded-xxs bg-form-fields-file-upload-default cursor-pointer"
                onClick={() => window.open(doc.downloadUrl, "_blank")}
                tabIndex={0}
                role="button"
              >
                <span className="text-text-default text-s">
                  {language === "ar" ? doc.documentNameA : doc.documentNameE}
                </span>
                <Document className="text-text-default text-l" />
              </div>
            ))}
          </>
        )}
      </div>
      {registrationRemarks && (
        <section>
          <h3 className="text-heading-h3 text-text-default font-bold mt-8 mb-4">
            <SharedLanguageSwitchRenderer
              language={language}
              value="Registration Remarks"
              value_ar="ملاحظات التسجيل"
            />
          </h3>
          <textarea
            rows={3}
            className="w-full text-text-default rounded-[8px] bg-form-fields-input-form-bg border border-form-fields-input-form-border text-m p-s resize-none focus:outline-none"
            placeholder=""
            value=""
            readOnly
          ></textarea>
        </section>
      )}
    </div>
  );
};

export default AuditRemarks;
