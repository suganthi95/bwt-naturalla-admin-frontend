import { ASSETS } from "@/assets/assets"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import Loader from "@/components/ui/Loader"
import { useAppContext } from "@/contexts/AuthContext";
import { validateUser } from "@/lib/apis";
import { ValidateUserType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function Welcome() {

    const { auth } = useAppContext();
    const navigate = useNavigate();
    const [ openEUADialog, setOpenEUADialog ] = useState<boolean>(false);
    const { isError, error } = useQuery({
        queryKey: [ "validateUser" ],
        queryFn: () => validateUser(auth?.token as string),
        retry: 0,
        select: (data): ValidateUserType => data?.data?.data,
        enabled: Boolean(auth?.token)
    });

    if(isError){
        toast.error("Request Failed", { description: error?.message })
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            setOpenEUADialog(true);
        }, 5000);

        () => clearTimeout(timeout);

    }, [])

  return (
    <div className="min-h-screen p-0 lg:p-2 bg-white">
        <div className="flex flex-row gap-3 mx-16">
            <img src={ASSETS.LOGO} alt="logo" />
            <div>
                <p className="font-bold text-3xl text-primary">Intelli<span className="text-secondary">Response</span></p>
                <span className="text-slate-500">
                    Turning Reviews Into Insights
                </span>
            </div>
        </div>

        <div className="flex flex-col items-center justify-between h-full gap-5 py-10">
            <div className="w-1/3">
                <img className="w-full h-full object-cover" src={ASSETS.WELCOME_IMG} alt="img" />
            </div>

            <div>
                <Loader/>
            </div>

            <div className="text-center mt-5">
                <h1 className="font-medium text-xl">Welcome to IntelliResponse!</h1>
                <p className="text-slate-400 text-sm">We’re excited to have you on board. Let’s get started with a few quick <br />questions to set up your account and personalize your experience.</p>
            </div>
        </div>

        <AlertDialog open={openEUADialog}>
            <AlertDialogContent className="max-w-7xl h-[70vh] overflow-hidden">
                <AlertDialogHeader>
                <AlertDialogTitle className="text-primary">User Agreement</AlertDialogTitle>
                <AlertDialogDescription>
                <div className="h-[350px] overflow-y-scroll">
                    <div className="space-y-6">
                        <p className="mt-3">
                            IntelliResponse is licensed to You (End-User) by Embrais Consultancy Private Limited, located and registered at No.38, 2nd Cross Azad Nagar,, Trichy, Tamilnadu 620021, India <span className="font-bold"> ("Licensor")</span>
                            , for use only under the terms of this License Agreement.
                        </p>
                        <p className="">
                            By downloading the Licensed Application from Apple's software distribution platform ("App Store") and Google's software distribution platform ("Play Store"), and any update thereto (as permitted by this License Agreement), You indicate that You agree to be bound by all of the terms and conditions of this License Agreement, and that You accept this License Agreement. App Store and Play Store are referred to in this License Agreement as <span className="font-bold">            "Services."
                        </span>
                        </p>
                        <p className="">
                            The parties of this License Agreement acknowledge that the Services are not a Party to this License Agreement and are not bound by any provisions or obligations with regard to the Licensed Application, such as warranty, liability, maintenance and support thereof. Embrais Consultancy Private Limited, not the Services, is solely responsible for the Licensed Application and the content thereof.
                        </p>
                        <p>This License Agreement may not provide for usage rules for the Licensed Application that are in conflict with the latest Apple Media Services Terms and Conditions and Google Play Terms of Service <span className="font-bold">("Usage Rules")</span>
                        . Embrais Consultancy Private Limited acknowledges that it had the opportunity to review the Usage Rules and this License Agreement is not conflicting with them.</p>

                        <p>IntelliResponse when purchased or downloaded through the Services, is licensed to You for use only under the terms of this License Agreement. The Licensor reserves all rights not expressly granted to You. IntelliResponse is to be used on devices that operate with Apple's operating systems ("iOS" and "Mac OS") or Google's operating system ("Android").</p>

                        <div className="space-y-4">
                            <h2 className="text-lg font-bold mt-3">Table of Contents</h2>
                            <ol className="list-decimal list-inside space-y-2 uppercase">
                                <li>THE APPLICATION</li>
                                <li>SCOPE OF LICENSE</li>
                                <li>TECHNICAL REQUIREMENTS</li>
                                <li>MAINTENANCE AND SUPPORT</li>
                                <li>USER-GENERATED CONTRIBUTIONS</li>
                                <li>CONTRIBUTION LICENSE</li>
                                <li>LIABILITY</li>
                                <li>WARRANTY</li>
                                <li>PRODUCT CLAIMS</li>
                                <li>LEGAL COMPLIANCE</li>
                                <li>CONTACT INFORMATION</li>
                                <li>TERMINATION</li>
                                <li>THIRD-PARTY TERMS OF AGREEMENTS AND BENEFICIARY</li>
                                <li>INTELLECTUAL PROPERTY RIGHTS</li>
                                <li>APPLICABLE LAW</li>
                                <li>MISCELLANEOUS</li>
                            </ol>
                        </div>

                        <h2 className="text-lg font-bold mt-3">1. THE APPLICATION</h2>
                        <p>
                            IntelliResponse ("Licensed Application") is a piece of software created to . Generate AI-Powered Responses: Utilize advanced AI technology to generate tailored responses to customer reviews, saving business owners time and effort while ensuring responses are consistent and professional. . Enhance Customer Engagement: Improve customer engagement and satisfaction by enabling timely and personalized responses to reviews, which can enhance the reputation of the business. . Provide Insights and Analytics: Offer detailed analytics and insights into review trends, customer sentiments, and overall business performance, allowing business owners to make informed decisions and strategies . Support Multilingual Communication: Facilitate communication for non-English speaking business owners by generating responses in multiple languages, helping them to effectively engage with a diverse customer base. — and customized for iOS and Android mobile devices ("Devices"). It is used to 1. Automate Review Responses: Automatically generate customized responses to online reviews using AI technology, ensuring consistency, professionalism, and timely engagement with customers. 2. Centralize Review Management: Provide a centralized platform for managing reviews across multiple platforms such as Google My Business, Booking.com, TripAdvisor, and Yelp, simplifying the process of monitoring and responding to feedback. 3. Enhance Customer Interaction: Improve customer interaction by providing tailored, contextually appropriate responses that address specific feedback, enhancing customer satisfaction and loyalty. 4. Analyze Customer Sentiments: Perform sentiment analysis on reviews to gain insights into customer feelings and perceptions, allowing business owners to address issues proactively and improve their services. 5. Save Time and Resources: Reduce the time and effort required for business owners to respond to reviews manually, freeing up resources to focus on other critical aspects of their business. 6. Support Multilingual Communication: Assist non-English speaking business owners by generating review responses in multiple languages, ensuring effective communication with a global customer base. 7. Offer Insights and Analytics: Provide detailed analytics and reports on review trends, customer sentiments, and business performance, helping business owners make informed decisions and improve their strategies. 8. Enhance Brand Reputation: Help maintain and enhance the brand’s online reputation by ensuring all reviews receive appropriate and timely responses, showcasing a commitment to customer satisfaction and service excellence..
                        </p>

                        <h2 className="text-lg font-bold mt-3">2. SCOPE OF LICENSE</h2>

                        <p>
                        2.1 You are given a non-transferable, non-exclusive, non-sublicensable license to install and use the Licensed Application on any Devices that You (End-User) own or control and as permitted by the Usage Rules, with the exception that such Licensed Application may be accessed and used by other accounts associated with You (End-User, The Purchaser) via Family Sharing or volume purchasing.
                        </p>

                        <p>
                        2.2 This license will also govern any updates of the Licensed Application provided by Licensor that replace, repair, and/or supplement the first Licensed Application, unless a separate license is provided for such update, in which case the terms of that new license will govern.
                        </p>

                        <p>
                        2.3 You may not share or make the Licensed Application available to third parties (unless to the degree allowed by the Usage Rules, and with Embrais Consultancy Private Limited's prior written consent), sell, rent, lend, lease or otherwise redistribute the Licensed Application.
                        </p>

                        <p>
                        2.4 You may not reverse engineer, translate, disassemble, integrate, decompile, remove, modify, combine, create derivative works or updates of, adapt, or attempt to derive the source code of the Licensed Application, or any part thereof (except with Embrais Consultancy Private Limited's prior written consent).
                        </p>

                        <p>
                        2.5 You may not copy (excluding when expressly authorized by this license and the Usage Rules) or alter the Licensed Application or portions thereof. You may create and store copies only on devices that You own or control for backup keeping under the terms of this license, the Usage Rules, and any other terms and conditions that apply to the device or software used. You may not remove any intellectual property notices. You acknowledge that no unauthorized third parties may gain access to these copies at any time. If you sell your Devices to a third party, you must remove the Licensed Application from the Devices before doing so.
                        </p>

                        <p>
                        2.6 Violations of the obligations mentioned above, as well as the attempt of such infringement, may be subject to prosecution and damages.
                        </p>

                        <p>
                        2.7 Licensor reserves the right to modify the terms and conditions of licensing.
                        </p>

                        <p>
                        2.8 Nothing in this license should be interpreted to restrict third-party terms. When using the Licensed Application, You must ensure that You comply with applicable third-party terms and conditions.
                        </p>
                        <h2 className="text-lg font-bold mt-3">3. TECHNICAL REQUIREMENTS</h2>

                        <p>3.1  The Licensed Application requires a firmware version 1.0.0 or higher. Licensor recommends using the latest version of the firmware.</p>
                        <p>3.2  Licensor attempts to keep the Licensed Application updated so that it complies with modified/new versions of the firmware and new hardware. You are not granted rights to claim such an update.</p>
                        <p>3.3  You acknowledge that it is Your responsibility to confirm and determine that the app end-user device on which You intend to use the Licensed Application satisfies the technical specifications mentioned above.</p>
                        <p>3.4  Licensor reserves the right to modify the technical specifications as it sees appropriate at any time.</p>

                        <h2 className="text-lg font-bold mt-3">4. MAINTENANCE AND SUPPORT</h2>

                        <p>4.1  The Licensor is solely responsible for providing any maintenance and support services for this Licensed Application. You can reach the Licensor at the email address listed in the App Store or Play Store Overview for this Licensed Application.</p>
                        <p>4.2  Embrais Consultancy Private Limited and the End-User acknowledge that the Services have no obligation whatsoever to furnish any maintenance and support services with respect to the Licensed Application.</p>

                        <h2 className="text-lg font-bold mt-3">5. USE OF DATA</h2>

                        <p>You acknowledge that Licensor will be able to access and adjust Your downloaded Licensed Application content and Your personal information, and that Licensor's use of such material and information is subject to Your legal agreements with Licensor and Licensor's privacy policy, which can be found at the bottom of the Licensed Application.</p>
                        <p>You acknowledge that the Licensor may periodically collect and use technical data and related information about your device, system, and application software, and peripherals, offer product support, facilitate the software updates, and for purposes of providing other services to you (if any) related to the Licensed Application. Licensor may also use this information to improve its products or to provide services or technologies to you, as long as it is in a form that does not personally identify you.</p>


                        <h2 className="text-lg font-bold mt-3">6. USER-GENERATED CONTRIBUTIONS</h2>

                        <p>The Licensed Application does not offer users to submit or post content. We may provide you with the opportunity to create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and materials to us or in the Licensed Application, including but not limited to text, writings, video, audio, photographs, graphics, comments, suggestions, or personal information or other material (collectively, "Contributions"). Contributions may be viewable by other users of the Licensed Application and through third-party websites or applications. As such, any Contributions you transmit may be treated in accordance with the Licensed Application Privacy Policy. When you create or make available any Contributions, you thereby represent and warrant that:</p>


                        <ol className='list-decimal list-inside space-y-2'>
                        <li>The creation, distribution, transmission, public display, or performance, and the accessing, downloading, or copying of your Contributions do not and will not infringe the proprietary rights, including but not limited to the copyright, patent, trademark, trade secret, or moral rights of any third party.</li>
                        <li>You are the creator and owner of or have the necessary licenses, rights, consents, releases, and permissions to use and to authorize us, the Licensed Application, and other users of the Licensed Application to use your Contributions in any manner contemplated by the Licensed Application and this License Agreement.</li>
                        <li>You have the written consent, release, and/or permission of each and every identifiable individual person in your Contributions to use the name or likeness or each and every such identifiable individual person to enable inclusion and use of your Contributions in any manner contemplated by the Licensed Application and this License Agreement.</li>
                        <li>Your Contributions are not false, inaccurate, or misleading</li>
                        <li>Your Contributions are not unsolicited or unauthorized advertising, promotional materials, pyramid schemes, chain letters, spam, mass mailings, or other forms of solicitation.</li>
                        <li>Your Contributions are not obscene, lewd, lascivious, filthy, violent, harassing, libelous, slanderous, or otherwise objectionable (as determined by us).</li>
                        <li>Your Contributions do not ridicule, mock, disparage, intimidate, or abuse anyone.</li>
                        <li>Your Contributions are not used to harass or threaten (in the legal sense of those terms) any other person and to promote violence against a specific person or class of people.</li>
                        <li>Your Contributions do not violate any applicable law, regulation, or rule.</li>
                        <li>Your Contributions do not violate the privacy or publicity rights of any third party.</li>
                        <li>Your Contributions do not violate any applicable law concerning child pornography, or otherwise intended to protect the health or well-being of minors</li>
                        <li>Your Contributions do not include any offensive comments that are connected to race, national origin, gender, sexual preference, or physical handicap</li>
                        <li>Your Contributions do not otherwise violate, or link to material that violates, any provision of this License Agreement, or any applicable law or regulation.</li>

                        </ol>
                        <p>Any use of the Licensed Application in violation of the foregoing violates this License Agreement and may result in, among other things, termination or suspension of your rights to use the Licensed Application.</p>

                        <h2 className="text-lg font-bold mt-3">7. CONTRIBUTION LICENSE</h2>

                        <p>You agree that we may access, store, process, and use any information and personal data that you provide following the terms of the Privacy Policy and your choices (including settings).</p>
                        <p>By submitting suggestions of other feedback regarding the Licensed Application, you agree that we can use and share such feedback for any purpose without compensation to you.</p>

                        <p>We do not assert any ownership over your Contributions. You retain full ownership of all of your Contributions and any intellectual property rights or other proprietary rights associated with your Contributions. We are not liable for any statements or representations in your Contributions provided by you in any area in the Licensed Application. You are solely responsible for your Contributions to the Licensed Application and you expressly agree to exonerate us from any and all responsibility and to refrain from any legal action against us regarding your Contributions.</p>

                        <h2 className="text-lg font-bold mt-3">8. LIABILITY</h2>

                        <p>
                        8.1  Licensor's responsibility in the case of violation of obligations and tort shall be limited to intent and gross negligence. Only in case of a breach of essential contractual duties (cardinal obligations), Licensor shall also be liable in case of slight negligence. In any case, liability shall be limited to the foreseeable, contractually typical damages. The limitation mentioned above does not apply to injuries to life, limb, or health.
                        </p>

                        <p>
                        8.2  Licensor takes no accountability or responsibility for any damages caused due to a breach of duties according to Section 2 of this License Agreement. To avoid data loss, You are required to make use of backup functions of the Licensed Application to the extent allowed by applicable third-party terms and conditions of use. You are aware that in case of alterations or manipulations of the Licensed Application, You will not have access to the Licensed Application.
                        </p>

                        <p>
                        8.3  Licensor takes no accountability and responsibility in case of No Guarantee of Accuracy: The Company does not guarantee the accuracy, completeness, or reliability of any content or information provided by the Application, including AI-generated responses. Users acknowledge that the use of the Application and its outputs are at their own risk..
                        </p>

                        <p>
                        8.4  Licensor takes no accountability and responsibility in case of Third-Party Services: The Company is not responsible for any actions or inactions of third-party service providers or platforms integrated with the Application. Any issues or disputes arising from such third-party services are solely between the user and the third-party provider..
                        </p>

                        <p>
                        8.5 Licensor takes no accountability and responsibility in case of Indirect Damages: The Company is not liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities, arising out of or related to the use of or inability to use the Application.
                        </p>

                        <p>
                        8.6 Licensor takes no accountability and responsibility in case of Service Interruptions: The Company does not guarantee uninterrupted or error-free operation of the Application. The Company is not liable for any interruptions, delays, or failures in the performance of the Application.
                        </p>

                        <p>
                        8.7 Licensor takes no accountability and responsibility in case of User Responsibility: Users are responsible for ensuring their use of the Application complies with all applicable laws and regulations. The Company is not liable for any consequences resulting from the user’s non-compliance.
                        </p>

                        <p>
                        8.8 Licensor takes no accountability and responsibility in case of Security Measures: While the Company implements reasonable security measures to protect user data, it does not guarantee that unauthorized third parties will never be able to defeat those measures. The Company is not liable for any unauthorized access, use, or disclosure of user data.
                        </p>

                        <p>
                        8.9 Licensor takes no accountability and responsibility in case of No Warranties: The Application is provided “as is” and “as available” without any warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
                        </p>

                        <p>
                        8.10 Licensor takes no accountability and responsibility in case of Changes to the Application: The Company reserves the right to modify, suspend, or discontinue the Application or any part of it at any time without notice. The Company is not liable for any impact this may have on users.
                        </p>

                        <p>
                        8.11 Licensor takes no accountability and responsibility in case of Limitations by Jurisdiction: Some jurisdictions do not allow the exclusion or limitation of certain damages or liabilities. In such cases, the Company’s liability will be limited to the fullest extent permitted by applicable law.
                        </p>

                        <h2 className="text-lg font-bold mt-3">9. WARRANTY</h2>

                        <p>
                        9.1 Licensor warrants that the Licensed Application is free of spyware, trojan horses, viruses, or any other malware at the time of Your download. Licensor warrants that the Licensed Application works as described in the user documentation.
                        </p>

                        <p>
                        9.2 No warranty is provided for the Licensed Application that is not executable on the device, that has been unauthorizedly modified, handled inappropriately or culpably, combined or installed with inappropriate hardware or software, used with inappropriate accessories, regardless if by Yourself or by third parties, or if there are any other reasons outside of Embrais Consultancy Private Limited's sphere of influence that affect the executability of the Licensed Application.
                        </p>

                        <p>
                        9.3 You are required to inspect the Licensed Application immediately after installing it and notify Embrais Consultancy Private Limited about issues discovered without delay by email provided in Contact Information. The defect report will be taken into consideration and further investigated if it has been emailed within a period of thirty (30) days after discovery.
                        </p>

                        <p>
                        9.4 If we confirm that the Licensed Application is defective, Embrais Consultancy Private Limited reserves a choice to remedy the situation either by means of solving the defect or substitute delivery.
                        </p>

                        <p>
                        9.5 In the event of any failure of the Licensed Application to conform to any applicable warranty, You may notify the Services Store Operator, and Your Licensed Application purchase price will be refunded to You. To the maximum extent permitted by applicable law, the Services Store Operator will have no other warranty obligation whatsoever with respect to the Licensed Application, and any other losses, claims, damages, liabilities, expenses, and costs attributable to any negligence to adhere to any warranty.
                        </p>

                        <p>
                        9.6 If the user is an entrepreneur, any claim based on faults expires after a statutory period of limitation amounting to twelve (12) months after the Licensed Application was made available to the user. The statutory periods of limitation given by law apply for users who are consumers.
                        </p>
                        <h2 className="text-lg font-bold mt-3">10. PRODUCT CLAIMS</h2>

                        <p>
                        Embrais Consultancy Private Limited and the End-User acknowledge that Embrais Consultancy Private Limited, and not the Services, is responsible for addressing any claims of the End-User or any third party relating to the Licensed Application or the End-User’s possession and/or use of that Licensed Application, including, but not limited to:
                        </p>

                        <p>(i) product liability claims;</p>
                        <p>(ii) any claim that the Licensed Application fails to conform to any applicable legal or regulatory requirement; and</p>
                        <p>(iii) claims arising under consumer protection, privacy, or similar legislation, including in connection with Your Licensed Application’s use of the HealthKit and HomeKit.</p>

                        <h2 className="text-lg font-bold mt-3">11. LEGAL COMPLIANCE</h2>

                        <p>
                        You represent and warrant that You are not located in a country that is subject to a US Government embargo, or that has been designated by the US Government as a "terrorist supporting" country; and that You are not listed on any US Government list of prohibited or restricted parties.
                        </p>
                        <h2 className="text-lg font-bold mt-3">12. CONTACT INFORMATION</h2>

                        <p>
                        For general inquiries, complaints, questions or claims concerning the Licensed Application, please contact:
                        </p>
                        <div>
                        <p>Embrais Consultancy Private Limited</p>
                        <p>No.38, 2nd Cross Azad Nagar,</p>
                        <p>Trichy, Tamilnadu 620021</p>
                        <p>India</p>
                        <p><a href="mailto:support@embrais.com">support@embrais.com</a></p>

                        </div>

                        <h2 className="text-lg font-bold mt-3">13. TERMINATION</h2>

                        <p>
                        The license is valid until terminated by Embrais Consultancy Private Limited or by You. Your rights under this license will terminate automatically and without notice from Embrais Consultancy Private Limited if You fail to adhere to any term(s) of this license. Upon License termination, You shall stop all use of the Licensed Application, and destroy all copies, full or partial, of the Licensed Application.
                        </p>

                        <h2 className="text-lg font-bold mt-3">14. THIRD-PARTY TERMS OF AGREEMENTS AND BENEFICIARY</h2>

                        <p>
                        Embrais Consultancy Private Limited represents and warrants that Embrais Consultancy Private Limited will comply with applicable third-party terms of agreement when using Licensed Application.
                        </p>
                        <p>In Accordance with Section 9 of the "Instructions for Minimum Terms of Developer's End-User License Agreement," both Apple and Google and their subsidiaries shall be third-party beneficiaries of this End User License Agreement and — upon Your acceptance of the terms and conditions of this License Agreement, both Apple and Google will have the right (and will be deemed to have accepted the right) to enforce this End User License Agreement against You as a third-party beneficiary thereof.</p>

                        <h2 className="text-lg font-bold mt-3">15. INTELLECTUAL PROPERTY RIGHTS</h2>

                        <p>
                        Embrais Consultancy Private Limited and the End-User acknowledge that, in the event of any third-party claim that the Licensed Application or the End-User's possession and use of that Licensed Application infringes on the third party's intellectual property rights, Embrais Consultancy Private Limited, and not the Services, will be solely responsible for the investigation, defense, settlement, and discharge or any such intellectual property infringement claims.
                        </p>

                        <h2 className="text-lg font-bold mt-3">16. APPLICABLE LAW</h2>

                        <p>
                        This License Agreement is governed by the laws of India excluding its conflicts of law rules.
                        </p>

                        <h2 className="text-lg font-bold mt-3">17. MISCELLANEOUS</h2>

                        <p>
                        17.1  If any of the terms of this agreement should be or become invalid, the validity of the remaining provisions shall not be affected. Invalid terms will be replaced by valid ones formulated in a way that will achieve the primary purpose.
                        </p>

                        <p>17.2  Collateral agreements, changes and amendments are only valid if laid down in writing. The preceding clause can only be waived in writing.</p>


                    </div>

                </div>
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogAction onClick={() => navigate("/onboard")}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  )
}

export default Welcome