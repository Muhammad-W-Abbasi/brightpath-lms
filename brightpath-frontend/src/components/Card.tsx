import { ReactNode } from "react";

type CardProps = {
  title?: string;
  subtitle?: string;
  className?: string;
  children: ReactNode;
  actions?: ReactNode;
};

function Card({ title, subtitle, className = "", children, actions }: CardProps) {
  return (
    <section className={`bp-card ${className}`.trim()}>
      {(title || subtitle || actions) && (
        <div className="bp-card-header">
          <div>
            {title && <h3 className="bp-card-title">{title}</h3>}
            {subtitle && <p className="bp-card-subtitle">{subtitle}</p>}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div className="bp-card-body">{children}</div>
    </section>
  );
}

export default Card;
